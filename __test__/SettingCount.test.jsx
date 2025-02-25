import { expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { drawDataContext } from '../src/app/drawDataContext';
import SettingCount from '../src/app/components/SettingCount';
import fs from 'node:fs/promises';

it('아무 입력도 하지 않고 다음 버튼을 눌렀을 경우, 참가자 수 오류메시지 출력하기', async () => {
  const user = userEvent.setup();
  const { unmount } = render(
    <drawDataContext.Provider
      value={{ drawData: { participantCount: 0, winnerCount: 0 } }}
    >
      <SettingCount />
    </drawDataContext.Provider>
  );
  await user.click(screen.getByText('다음'));
  expect(
    screen.getByText('참가자 수는 1 ~ 50명 사이 이어야 합니다.')
  ).toBeDefined();
  unmount();
});

it('참가인원 수만 입력하고 다음 버튼을 눌렀을 경우, 당첨자 수 오류메시지 출력하기', async () => {
  const user = userEvent.setup();
  const { unmount } = render(
    <drawDataContext.Provider
      value={{ drawData: { participantCount: 0, winnerCount: 0 } }}
    >
      <SettingCount />
    </drawDataContext.Provider>
  );
  await user.type(screen.getByLabelText('참가인원'), '3');
  await user.click(screen.getByText('다음'));
  expect(
    screen.getByText(
      '당첨자 수는 1명 보다 많고, 참가자 수 보다 같거나 작아야 합니다.'
    )
  ).toBeDefined();
  unmount();
});
it('당첨자 수만 입력하고 다음 버튼을 눌렀을 경우, 참가자 수 오류메시지 출력하기', async () => {
  const user = userEvent.setup();
  const { unmount } = render(
    <drawDataContext.Provider
      value={{ drawData: { participantCount: 0, winnerCount: 0 } }}
    >
      <SettingCount />
    </drawDataContext.Provider>
  );
  await user.type(screen.getByLabelText('당첨자'), '3');
  await user.click(screen.getByText('다음'));
  expect(
    screen.getByText('참가자 수는 1 ~ 50명 사이 이어야 합니다.')
  ).toBeDefined();
  unmount();
});
it('당첨자 수가 참가인원 수보다 많으면 당첨자 수 오류메시지 출력하기', async () => {
  const user = userEvent.setup();
  const { unmount } = render(
    <drawDataContext.Provider
      value={{ drawData: { participantCount: 0, winnerCount: 0 } }}
    >
      <SettingCount />
    </drawDataContext.Provider>
  );
  await user.type(screen.getByLabelText('참가인원'), '2');
  await user.type(screen.getByLabelText('당첨자'), '3');
  await user.click(screen.getByText('다음'));
  expect(
    screen.getByText(
      '당첨자 수는 1명 보다 많고, 참가자 수 보다 같거나 작아야 합니다.'
    )
  ).toBeDefined();
  unmount();
});

it('참가인원 수가 범위의 하한선 보다 작으면, 오류메시지 출력하기', async () => {
  const user = userEvent.setup();
  const { unmount } = render(
    <drawDataContext.Provider
      value={{ drawData: { participantCount: 0, winnerCount: 0 } }}
    >
      <SettingCount />
    </drawDataContext.Provider>
  );
  await user.type(screen.getByLabelText('참가인원'), '-50000');
  await user.click(screen.getByText('다음'));
  expect(
    screen.getByText('참가자 수는 1 ~ 50명 사이 이어야 합니다.')
  ).toBeDefined();
  unmount();
});
it('참가인원 수가 범위의 상한선 보다 크면, 오류메시지 출력하기', async () => {
  const user = userEvent.setup();
  const { unmount } = render(
    <drawDataContext.Provider
      value={{ drawData: { participantCount: 0, winnerCount: 0 } }}
    >
      <SettingCount />
    </drawDataContext.Provider>
  );
  await user.type(screen.getByLabelText('참가인원'), '50000');
  await user.click(screen.getByText('다음'));
  expect(
    screen.getByText('참가자 수는 1 ~ 50명 사이 이어야 합니다.')
  ).toBeDefined();
  unmount();
});

it('당첨자 수가 1명보다 작을 경우 당첨자 수 오류메시지 출력하기', async () => {
  const user = userEvent.setup();
  const { unmount } = render(
    <drawDataContext.Provider
      value={{ drawData: { participantCount: 0, winnerCount: 0 } }}
    >
      <SettingCount />
    </drawDataContext.Provider>
  );
  await user.type(screen.getByLabelText('참가인원'), '2');
  await user.type(screen.getByLabelText('당첨자'), '-1');
  await user.click(screen.getByText('다음'));
  expect(
    screen.getByText(
      '당첨자 수는 1명 보다 많고, 참가자 수 보다 같거나 작아야 합니다.'
    )
  ).toBeDefined();
  unmount();
});

it('참가인원 명단 리스트 파일(.csv) 파일을 올렸을 때 참가인원 수 채우고, 파일명 표시하기', async () => {
  const listFileData = await fs.readFile('__test__/participantList.csv');
  Blob.prototype.text = () => undefined;
  vi.spyOn(Blob.prototype, 'text').mockImplementation(function () {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();

      fr.onload = (event) => {
        resolve(event.target.result);
      };

      fr.onerror = (error) => {
        reject(error);
      };

      fr.readAsText(this);
    });
  });
  const context = {
    drawData: { participantCount: 0, winnerCount: 0 },
    setDrawData: (newDrawData) => {
      this.drawData = { ...newDrawData };
    },
  };
  const user = userEvent.setup();
  const { unmount } = render(
    <drawDataContext.Provider value={context}>
      <SettingCount />
    </drawDataContext.Provider>
  );
  const fileInput = screen.getByLabelText('참가 인원 리스트');
  await user.upload(
    fileInput,
    new File([listFileData], 'participantList.csv', { type: 'text/csv' })
  );
  expect(fileInput.files.length).toBe(1);
  expect(screen.getByLabelText('참가인원').value).toBe('3');
  expect(screen.getByPlaceholderText('participantList.csv')).toBeDefined();
  unmount();
});
