import { it, expect } from 'vitest';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingParticiant from '../src/app/components/SettingParticipant';
import { drawDataContext } from '../src/app/drawDataContext';
it('경품추첨 모드에서는 이름, 이메일 입력 폼 모두 표시하기');
it(
  '경품추첨 모드에서 초기화면에서 다음 버튼을 눌렀을 경우, 올바른 에러메시지 출력하기'
);
it(
  '경품추첨 모드에서 참가자 이메일을 입력하지 않았을 때, 올바른 에러메시지 출력하기'
);
it(
  '경품추첨 모드에서 참가자 이메일을 입력하지 않았을 때, 올바른 에러메시지 출력하기'
);

it('참가자 명을 입력하지 않았을 때, 올바른 에러메시지 출력하기');
it('단순추첨 모드에서는 이메일 입력 폼 표시하지 않기');
it(
  '단숨추첨 모드에서 초기화면에서 그냥 다음 버튼을 눌렀을 경우, 올바른 에러메시지 출력하기'
);
it('올바르지 않은 참가자 명을 입력했을 때, 올바른 에러메시지 출력하기');
it(
  '경품추첨 모드일 경우 올바르지 않은 이메일을 입력했을 때, 올바른 에러메시지 출력하기'
);
