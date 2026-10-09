import axios from 'axios';

export function commentLabel(count: number) {
  return count === 1 ? '1 comment' : `${count} comments`;
}

export function errorMessage(error: unknown) {
  if (axios.isAxiosError(error) && !error.response) {
    return 'No connection. Check your network and try again.';
  }
  return 'The posts service could not be reached. Try again.';
}
