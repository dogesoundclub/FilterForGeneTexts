const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const fs = require("fs");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const mbtiList = [
    'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
    'ISTP', 'ISFP', 'INFP', 'INTP',
    'ESTP', 'ESFP', 'ENFP', 'ENTP',
    'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
];

async function main() {
  for(let i = 0; i<mbtiList.length; i++){
      try {
        let text = 'let me know some funny feature of '+ mbtiList[i] +' person. Drop the '+ mbtiList[i] +' word';
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{role: "user", content: text}],
        });
        fs.writeFileSync("./" + mbtiList[i] + ".txt", completion.data.choices[0].message.content);
      } catch (error) {
        console.error(error);
      }
  }
}
main();