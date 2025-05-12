export default function decorate(block) {
  const head = document.head;
  const script = document.createElement('script');
  script.src = "https://js.puter.com/v2/";
  head.appendChild(script);
  Puter.
 async function streamClaudeResponse() {
            const response = await puter.ai.chat(
                "Write a detailed essay on the impact of artificial intelligence on society",
                {model: 'claude-3-5-sonnet', stream: true}
            );

            for await (const part of response) {
                puter.print(part?.text);
            }
        }

        streamClaudeResponse();

}