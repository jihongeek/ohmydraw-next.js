import { expect, it } from 'vitest';
import SettingMode from '../src/app/components/SettingMode';
import { drawDataContext } from '../src/app/drawDataContext';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/node';
import { http, HttpResponse } from 'msw';
it('단순추첨 라디오 버튼을 클릭시 비밀번호 인풋 표시하지 않기', async () => {
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
  expect(screen.queryByText('비밀번호')).toBeNull();
  unmount();
});
it('경품추첨 라디오 버튼을 클릭시 비밀번호 인풋 표시하기', async () => {
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
  expect(screen.getAllByText('비밀번호')).toBeDefined();
  unmount();
});

it('비밀번호를 입력하지 않았을 경우, 알맞은 에러 메시지 출력하기', async () => {
  const { unmount } = render(
    <drawDataContext.Provider
      value={{ drawData: { mode: 'gift', sendKey: '' } }}
    >
      <SettingMode />
    </drawDataContext.Provider>
  );
  const user = userEvent.setup();
  await user.click(screen.getByText('다음'));
  expect(screen.getAllByText('비밀번호를 입력해 주세요.')).toBeDefined();
  unmount();
});
it('비밀번호를 틀렸을 경우, 알맞은 에러 메시지 출력하기', async () => {
  const { unmount } = render(
    <drawDataContext.Provider
      value={{ drawData: { mode: 'gift', sendKey: '' } }}
    >
      <SettingMode />
    </drawDataContext.Provider>
  );
  server.use(
    http.post(`${process.env.NEXT_PUBLIC_BASE_URL}/sendkey/validate`, () => {
      return HttpResponse.json(JSON.stringify({ isValid: false }), {
        status: 200,
      });
    })
  );
  const user = userEvent.setup();
  const WRONG_SEND_KEY = `${process.env.SEND_KEY}`;
  await user.type(screen.getByLabelText('비밀번호'), WRONG_SEND_KEY);
  await user.click(screen.getByText('다음'));
  expect(screen.getAllByText('올바르지 않은 비밀번호입니다.')).toBeDefined();
  unmount();
});
it('비밀번호를 확인할 수 없을 경우, 알맞은 에러 메시지 출력하기', async () => {
  const { unmount } = render(
    <drawDataContext.Provider
      value={{ drawData: { mode: 'gift', sendKey: '' } }}
    >
      <SettingMode />
    </drawDataContext.Provider>
  );
  server.use(
    http.post(`${process.env.NEXT_PUBLIC_BASE_URL}/sendkey/validate`, () => {
      return HttpResponse.json('', {
        status: 500,
      });
    })
  );
  const user = userEvent.setup();
  const WRONG_SEND_KEY = `${process.env.SEND_KEY}`;
  await user.type(screen.getByLabelText('비밀번호'), WRONG_SEND_KEY);
  await user.click(screen.getByText('다음'));
  expect(
    screen.getAllByText('현재 비밀번호를 확인할 수 없습니다.')
  ).toBeDefined();
  unmount();
});
