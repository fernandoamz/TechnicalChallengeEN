import axios, { type AxiosResponse } from 'axios';

import { commentLabel, errorMessage } from '@/lib/format';

describe('commentLabel', () => {
  test('uses the singular only for one comment', () => {
    expect(commentLabel(0)).toBe('0 comments');
    expect(commentLabel(1)).toBe('1 comment');
    expect(commentLabel(5)).toBe('5 comments');
  });
});

describe('errorMessage', () => {
  test('names a missing connection when the request never got a response', () => {
    const error = new axios.AxiosError('Network Error');

    expect(errorMessage(error)).toBe('No connection. Check your network and try again.');
  });

  test('uses the service message when the server answered or the error is unknown', () => {
    const httpError = new axios.AxiosError('Request failed');
    httpError.response = { status: 500 } as AxiosResponse;

    expect(errorMessage(httpError)).toBe('The posts service could not be reached. Try again.');
    expect(errorMessage(new Error('boom'))).toBe('The posts service could not be reached. Try again.');
  });
});
