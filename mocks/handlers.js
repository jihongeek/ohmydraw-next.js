import { http, HttpResponse } from 'msw';

export const handlers = [
  // 당첨자 경품 발송
  http.post('/sent-gifts', () => {
    const randomNumber = Math.floor(Math.random() * 10);
    if (randomNumber % 2 === 0) {
      return HttpResponse.json('', { status: 201 });
    } else {
      return HttpResponse.json('', { status: 400 });
    }
  }),
  http.post('/sendkey/validate', async ({ request }) => {
    const requestJson = await request.json();
    return HttpResponse.json(
      { ...requestJson, isValid: true },
      { status: 200 }
    );
  }),
];
