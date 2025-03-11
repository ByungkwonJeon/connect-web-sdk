@Slf4j
@RequiredArgsConstructor
@Service
public class AvvAccountService {

    private final AvvAccountRepository avvAccountRepository;
    private final AvvRequestMapper avvRequestMapper;
    private final ConsentSessionService consentSessionService;
    private final LambdaClient lambdaClient;

    @Value("${kratos.avs-lambda-name:default-lambda}")
    private String lambdaFunctionName;

    @Value("${avs.max-attempts:3}")
    private int maxAvsCount;

    /**
     * Save AVV Account details.
     */
    public Mono<ApiAccountVerificationResponse> saveAvvAccountDetails(String linkId, ServiceAvvAccount avvAccount) {
        return consentSessionService.getConsentSession(linkId)
                .switchIfEmpty(Mono.error(new KratosException(ErrorCode.NOT_FOUND, "No such Avv-account found for consentId: " + linkId)))
                .flatMap(consentSession ->
                    invokeAvsLambda(avvRequestMapper.toAvvRequest(avvAccount, consentSession, AccountValidationType.ACCOUNT_VALIDATION))
                        .flatMap(avvResponse -> processAvvVerification(avvResponse, avvAccount))
                )
                .doOnSuccess(response -> log.info("Successfully saved AVV account for linkId: {}", linkId))
                .doOnError(error -> log.error("Failed to save AVV account for linkId: {} - {}", linkId, error.getMessage()));
    }

    /**
     * Handle AVV Micro Deposit Verification.
     */
    public Mono<ApiAccountVerificationResponse> handleAvvMicroDepositValidation(String linkId, VerificationAmount verificationAmount) {
        log.info("Handling AVV micro-deposit validation for linkId: {}", linkId);

        return consentSessionService.getConsentSession(linkId)
                .switchIfEmpty(Mono.error(new KratosException(ErrorCode.NOT_FOUND, "No such Avv-account found for consentId: " + linkId)))
                .flatMap(consentSession ->
                    invokeAvsLambda(avvRequestMapper.toMicroDepositRequest(verificationAmount, consentSession, AccountValidationType.MICRO_DEPOSIT))
                        .flatMap(avvResponse -> processAvvVerification(avvResponse, new AvvAccountDto()))
                )
                .doOnSuccess(response -> log.info("Micro-deposit verification successful for linkId: {}", linkId))
                .doOnError(error -> log.error("Micro-deposit verification failed for linkId: {} - {}", linkId, error.getMessage()));
    }

    /**
     * Process AVV Verification.
     */
    private Mono<ApiAccountVerificationResponse> processAvvVerification(AvvResponse avvResponse, AvvAccountDto avvAccountDto) {
        log.debug("Processing AVV verification response: {}", avvResponse);

        if (avvResponse == null) {
            log.warn("Received empty AVV response");
            return Mono.error(new KratosException(ErrorCode.BAD_VALUE, "Empty AVV response"));
        }

        avvAccountDto.setStatus(avvResponse.getStatus());
        avvAccountDto.setVerificationAttempt(avvAccountDto.getVerificationAttempt() + 1);

        if (avvAccountDto.getVerificationAttempt() >= maxAvsCount) {
            avvAccountDto.setStatus(AvvStatus.FAILED.getValue());
        }

        avvAccountRepository.save(avvAccountDto);

        ApiAccountVerificationResponse response = ApiAccountVerificationResponse.builder()
                .status(avvAccountDto.getStatus())
                .accountDetails(ApiAccountSummary.builder()
                        .accountId(avvAccountDto.getAccountId())
                        .accountNumber(avvAccountDto.getLastFourDigitsAccountNumber())
                        .accountType(avvAccountDto.getAccountType())
                        .build())
                .build();

        log.info("AVV verification response processed: {}", response);

        return Mono.just(response);
    }

    /**
     * Invoke Lambda for AVS.
     */
    private Mono<AvvResponse> invokeAvsLambda(Object payload) {
        log.debug("Invoking Lambda function: {} with payload: {}", lambdaFunctionName, payload);

        try {
            String jsonPayload = JsonSerializeUtility.serialize(payload);
            InvokeRequest request = InvokeRequest.builder()
                    .functionName(lambdaFunctionName)
                    .payload(SdkBytes.fromUtf8String(jsonPayload))
                    .build();

            return lambdaClient.invoke(request)
                    .flatMap(response -> {
                        String responsePayload = response.payload().asUtf8String();
                        AvvResponse avvResponse = JsonSerializeUtility.deserialize(responsePayload, AvvResponse.class);

                        if (avvResponse == null) {
                            log.warn("Empty response from Lambda");
                            return Mono.error(new KratosException(ErrorCode.BAD_VALUE, "Empty response from Lambda"));
                        }

                        return Mono.just(avvResponse);
                    })
                    .doOnSuccess(response -> log.info("Lambda invocation successful"))
                    .doOnError(error -> log.error("Lambda invocation failed: {}", error.getMessage()));
        } catch (Exception e) {
            log.error("Failed to invoke Lambda function", e);
            return Mono.error(new KratosException(ErrorCode.SYSTEM_ERROR, "Failed to invoke Lambda function"));
        }
    }

    /**
     * Validate Account Details.
     */
    private Mono<Void> validateAccountDetails(ServiceAvvAccount accountDetails) {
        log.debug("Validating account details: {}", accountDetails);

        if (accountDetails == null) {
            return Mono.error(new KratosException(ErrorCode.BAD_VALUE, "Account details cannot be null"));
        }

        List<ErrorContext> errorContextList = accountDetails.getRoutingNumbers().stream()
                .filter(routingNumber -> !isValidRoutingNumber(routingNumber))
                .map(routingNumber -> new ErrorContext(ErrorCode.BAD_VALUE.getCode(), "Invalid Routing Number: " + routingNumber))
                .toList();

        if (!errorContextList.isEmpty()) {
            return Mono.error(new KratosException(ErrorCode.BAD_VALUE, errorContextList));
        }

        return Mono.empty();
    }

    /**
     * Validate Routing Number.
     */
    private boolean isValidRoutingNumber(String routingNumber) {
        if (routingNumber == null || routingNumber.length() != 9) return false;

        int[] digits = routingNumber.chars()
                .map(Character::getNumericValue)
                .toArray();

        int checksum = (3 * (digits[0] + digits[3] + digits[6]) +
                7 * (digits[1] + digits[4] + digits[7]) +
                (digits[2] + digits[5] + digits[8])) % 10;

        return checksum == 0;
    }
}