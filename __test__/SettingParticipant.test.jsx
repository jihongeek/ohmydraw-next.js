import { it, expect } from 'vitest';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingParticiant from '../src/app/components/SettingParticipant';
import { drawDataContext } from '../src/app/drawDataContext';
it('경품추첨 모드에서는 이름, 이메일 입력 폼 모두 표시하기', () => {
  const { unmount } = render(
    <drawDataContext.Provider
      value={{
        drawData: { mode: 'gift', participantCount: 1, participantArray: [] },
      }}
    >
      <SettingParticiant />
    </drawDataContext.Provider>
  );
  expect(screen.getByLabelText('이름'));
  expect(screen.getByLabelText('이메일'));
  unmount();
});
it('경품추첨 모드에서 초기화면에서 다음 버튼을 눌렀을 경우, 올바른 에러메시지 출력하기', async () => {
  const user = userEvent.setup();
  const { unmount } = render(
    <drawDataContext.Provider
      value={{
        drawData: {
          mode: 'gift',
          participantCount: 1,
          participantArray: [],
        },
      }}
    >
      <SettingParticiant />
    </drawDataContext.Provider>
  );
  await user.click(screen.getByText('다음'));
  screen.getByText(
    '이름은 특수문자를 제외한 영한문자 그리고 숫자만 가능합니다.'
  );
  screen.getByText('올바르지 않은 이메일 형식입니다.');
  unmount();
});
it('경품추첨 모드에서 참가자 이메일을 잘못 입력했을 때, 올바른 에러메시지 출력하기', async () => {
  const user = userEvent.setup();
  const { unmount } = render(
    <drawDataContext.Provider
      value={{
        drawData: {
          mode: 'gift',
          participantCount: 1,
          participantArray: [],
        },
      }}
    >
      <SettingParticiant />
    </drawDataContext.Provider>
  );
  await user.type(screen.getByLabelText('이름'), 'John Doe');
  await user.type(screen.getByLabelText('이메일'), 'john!doe.com');
  await user.click(screen.getByText('다음'));
  screen.getByText('올바르지 않은 이메일 형식입니다.');
  unmount();
});
it('경품추첨 모드에서 참가자 명을 잘못 입력했을 때, 올바른 에러메시지 출력하기', async () => {
  const user = userEvent.setup();
  const { unmount } = render(
    <drawDataContext.Provider
      value={{
        drawData: {
          mode: 'gift',
          participantCount: 1,
          participantArray: [],
        },
      }}
    >
      <SettingParticiant />
    </drawDataContext.Provider>
  );
  await user.type(screen.getByLabelText('이름'), 'John!Doe');
  await user.type(screen.getByLabelText('이메일'), 'john@doe.com');
  await user.click(screen.getByText('다음'));
  screen.getByText(
    '이름은 특수문자를 제외한 영한문자 그리고 숫자만 가능합니다.'
  );
  unmount();
});

it('단순추첨 모드에서는 이메일 입력 폼 표시하지 않기', () => {
  const { unmount } = render(
    <drawDataContext.Provider
      value={{
        drawData: {
          mode: 'no-gift',
          participantCount: 1,
          participantArray: [],
        },
      }}
    >
      <SettingParticiant />
    </drawDataContext.Provider>
  );
  expect(screen.getByLabelText('이름'));
  expect(screen.queryByLabelText('이메일')).toBeNull();
  unmount();
});
it('단숨추첨 모드에서 초기화면에서 그냥 다음 버튼을 눌렀을 경우, 올바른 에러메시지 출력하기', async () => {
  const user = userEvent.setup();
  const { unmount } = render(
    <drawDataContext.Provider
      value={{
        drawData: {
          mode: 'no-gift',
          participantCount: 1,
          participantArray: [],
        },
      }}
    >
      <SettingParticiant />
    </drawDataContext.Provider>
  );
  await user.click(screen.getByText('추첨하기'));
  expect(
    screen.getByText(
      '이름은 특수문자를 제외한 영한문자 그리고 숫자만 가능합니다.'
    )
  );
  unmount();
});
