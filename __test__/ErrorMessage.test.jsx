import { expect, it } from 'vitest';
import ErrorMessage from '../src/app/components/ui/ErrorMessage';
import { render, screen } from '@testing-library/react';

const errorMessages = {
  test: 'test',
};

it('에러가 없을 때 에러 메시지 표시안하기', () => {
  render(
    <ErrorMessage
      errorType={'none'}
      type={'test'}
      errorMessages={errorMessages}
    />
  );
  expect(screen.queryByText('test')).toBeNull();
});
