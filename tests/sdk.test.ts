import { Connect } from '../src/index';

test('should initialize iframe on launch', () => {
    Connect.launch('https://example.com', {
        onDone: jest.fn(),
        onCancel: jest.fn(),
        onError: jest.fn(),
    });

    expect(document.getElementById('connect-iframe')).not.toBeNull();
});