const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const axios = require("axios");
const fs = require("fs");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

// MBTI 무작위 10000개
function getRandomMBTI() {
    const mbtiList = [
        'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
        'ISTP', 'ISFP', 'INFP', 'INTP',
        'ESTP', 'ESFP', 'ENFP', 'ENTP',
        'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
    ];
    const randomIndex = Math.floor(Math.random() * mbtiList.length);
    return mbtiList[randomIndex];
}
const mbtiArray = [];
for (let i = 0; i < 10000; i++) {
  const mbti = getRandomMBTI();
  mbtiArray.push(mbti);
}

// 직업 무작위 10000개
function getRandomJobs() {
    const jobs = [
        'Police Officer', 'Traffic Officer', 'Firefighter', 'Fast Food Worker', 'Car Salesman', 'News Anchor', 'Security Guard', 'Reporter', 'Theater Manager', 'Train Driver', 'Electrician', 'Delivery Driver', 'Beautician', 'Doctor', 'Veterinarian', 'Real Estate Agent', 'Mechanic', 'Farmer', 'Mafia Boss', 'Programmer', 'Politician', 'Fashion Designer', 'Lawyer', 'Banker', 'Villain',
    ];
    const randomIndex = Math.floor(Math.random() * jobs.length);
    return jobs[randomIndex];
}
const jobsArray = [];
for (let i = 0; i < 10000; i++) {
    const jobs = getRandomJobs();
    jobsArray.push(jobs);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

async function main() {
    for(let i = 0; i<10000; i++){
        try {
            let api = await axios.get('https://api.dogesound.club/mate/'+i);
            const data = fs.readFileSync("./mbti/result/"+mbtiArray[i]+".txt").toString().split("\n");
            let Ask1 = 'The following information lists the appearance, species, and personality of a character for use in an urban fantasy novel.\n\n';
            let Ask2 = 'Please write a describtion for next character in urban fantasy style like SCP foundation.\n\n';
            let Identification_number = '- Identification number : '+ i +'\n';
            let Job = '- Job : ' + jobsArray[i] + '\n';
            let Species = '';
            let Sex = '';
            let Face_feature = ['', ''];
            let Eyes = '';
            let Head = '';
            let Forehead = ['', ''];
            let Ears = '';
            let Mouth = '';
            let Accesorry = ['', ''];
            let Personality = '- Personality : ' + data[getRandomInt(0, data.length)] + '\n';

            for(let j = 0; j < api.data.attributes.length; j++){
                if(api.data.attributes[j].trait_type == 'Face'){
                  if(api.data.attributes[j].value == 'Male' || api.data.attributes[j].value == 'Female') {
                    Species = "- Species : Human\n";
                    Sex = "- Sex : " + api.data.attributes[j].value + "\n";
                  } else {
                    Species = "- Species : "+api.data.attributes[j].value+"\n";
                    Sex = "- Sex : Male\n";
                  }
                } else if(api.data.attributes[j].trait_type == 'Face Detail A' || api.data.attributes[j].trait_type == 'Face Detail B'){
                  if(Face_feature[0]) {
                    Face_feature[1] = "- Face feature #2 : " + api.data.attributes[j].value + "\n";
                  } else {
                    Face_feature[0] = "- Face feature #1 : " + api.data.attributes[j].value + "\n";
                  }
                } else if(api.data.attributes[j].trait_type == 'Eyes'){
                  Eyes = "- Eyes : " + api.data.attributes[j].value + "\n";
                } else if(api.data.attributes[j].trait_type == 'Headwear'){
                  Head = "- Head : " + api.data.attributes[j].value + "\n";
                } else if(api.data.attributes[j].trait_type == 'Headwear Detail' || api.data.attributes[j].trait_type == 'Forehead'){
                  if(Forehead[0]){
                    Forehead[1] = "- Forehead feature #2 : " + api.data.attributes[j].value + "\n";
                  } else {
                    Forehead[0] = "- Forehead feature #1 : " + api.data.attributes[j].value + "\n";
                  }
                } else if(api.data.attributes[j].trait_type == 'Ears'){
                  Ears = "- Ears : " + api.data.attributes[j].value + "\n";
                } else if(api.data.attributes[j].trait_type == 'Mouth'){
                  Mouth = "- Mouth : " + api.data.attributes[j].value + "\n";
                } else if(api.data.attributes[j].trait_type == 'Items' || api.data.attributes[j].trait_type == 'Neck'){
                  if(Accesorry[0]){
                    Accesorry[1] = "- Accesorry #2 : " + api.data.attributes[j].value + "\n";
                  } else {
                    Accesorry[0] = "- Accesorry #1 : " + api.data.attributes[j].value + "\n";
                  }
                } else if(api.data.attributes[j].trait_type == 'Level'){
    
                } else {
    
                }
            }

            let text = Ask1 + Ask2 + Identification_number + Job + Species + Sex;
            for (let i = 0; i < Face_feature.length; i++){
                text += Face_feature[i];
            }
                text += Eyes + Head;
            for (let i = 0; i < Forehead.length; i++){
                text += Forehead[i];
            }
                text += Ears + Mouth;
            for (let i = 0; i < Accesorry.length; i++){
                text += Accesorry[i];
            }
                text += Personality;

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: text}],
            });
            fs.writeFileSync("./result/DSC-MATE-" + i.toString().padStart(4, '0') + ".txt", completion.data.choices[0].message.content.replace("\n", "").replace("\n", ""));
            console.log("DSC-MATE-" + i.toString().padStart(4, '0') + ".txt");
        } catch (e) {
            let error = fs.readFileSync("./error.txt");
            fs.writeFileSync("./error.txt", error+i+"\n");
            console.error(e);
        }
    }
}
main();