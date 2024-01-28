const { response } = require("express");

const API_KEY = "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";

const mytext = "What is world's highest mountain?";
let responsetext = "";

async function main(mytext) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: mytext }],
        temperature: 1.0,
        top_p: 0.7,
        n: 1,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 0,
      }),
    });
    console.log(response);

    if (response.ok) {
      const data = await response.json();
      responsetext = data.choices[0].message.content;
    } else {
      responsetext = "Error: Unable to process your request.";
    }
  } catch (error) {
    console.error(error);
    responsetext = "Error: Unable to process your request.";
  }
}

main(mytext);

console.log(responsetext);
