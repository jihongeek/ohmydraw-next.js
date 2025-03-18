import { expect, it } from 'vitest';
import SettingMode from '../src/app/components/SettingMode';
import { drawDataContext } from '../src/app/drawDataContext';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/node';
import { http, HttpResponse } from 'msw';
it('단순추첨 라디오 버튼을 클릭시 로그인 버튼 표시하지 말기', async () => {
  const { unmount } = render(
    <drawDataContext.Provider
      value={{ drawData: { mode: 'gift', sendKey: '' } }}
    >
      <SettingMode />
    </drawDataContext.Provider>
  );
  const user = userEvent.setup();
  const [_, NoGiftRadioButton] = screen.getAllByRole('radio');
  await user.click(NoGiftRadioButton);
  expect(screen.queryByText('Google로 로그인')).toBeNull();
  unmount();
});
it('경품추첨 라디오 버튼을 클릭시 로그인 버튼 표시하기', async () => {
  const { unmount } = render(
    <drawDataContext.Provider
      value={{ drawData: { mode: 'gift', sendKey: '' } }}
    >
      <SettingMode />
    </drawDataContext.Provider>
  );
  const user = userEvent.setup();
  const [GiftRadioButton, _] = screen.getAllByRole('radio');
  await user.click(GiftRadioButton);
  expect(screen.getAllByText('Google로 로그인')).toBeDefined();
  unmount();
});
