import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';
import { existsSync, readFile } from 'fs';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFile: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    const setTimeoutMock = jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, timeout);

    expect(setTimeoutMock).toHaveBeenCalledWith(expect.any(Function), timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and interval', () => {
    const callback = jest.fn();
    const interval = 1000;

    const setIntervalMock = jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, interval);

    expect(setIntervalMock).toHaveBeenCalledWith(
      expect.any(Function),
      interval,
    );
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
  const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should call join with pathToFile', async () => {
    jest.mock('fs', () => {
      return {
        existsSync: jest.fn().mockReturnValue(true),
      };
    });

    const pathToFile = 'file.txt';

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBeNull();
    expect(existsSync).toHaveBeenCalledWith(
      expect.stringContaining(pathToFile),
    );
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'file.txt';

    mockExistsSync.mockReturnValueOnce(false);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBeNull();
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  //incorrectly
  test('should return file content if file exists', async () => {
    const pathToFile = 'file.txt';
    const fileContent = 'Hello, World!';

    mockExistsSync.mockReturnValueOnce(true);
    mockReadFile.mockImplementationOnce((_, callback) => {
      callback(null, Buffer.from(fileContent));
    });

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe(fileContent);
    expect(mockExistsSync).toHaveBeenCalledWith(
      expect.stringContaining(pathToFile),
    );
    expect(mockReadFile).toHaveBeenCalledWith(
      expect.stringContaining(pathToFile),
      expect.any(Function),
    );
  });
});
