export const POST = async (request) => {
    const requestJson = await request.json();
    if (requestJson['sendKey'] === process.env['SEND_KEY'])
    {
        return new Response(JSON.stringify({...requestJson,"isValid" : true}),{status:200});
    }
    return new Response(JSON.stringify({...requestJson,"isValid" : false}),{status:200});
}