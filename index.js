const {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3"); // CommonJS import
const client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

module.exports.handler = async (event) => {
  const { fileName, logDump } = JSON.parse(event.body);
  const input = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
  };
  try {
    // Check if the file exists
    const headCommand = new HeadObjectCommand(input);
    await client.send(headCommand);

    // If it exists, get the file, append the logDump, and overwrite the file
    const getCommand = new GetObjectCommand(input);
    const { Body: readStream } = await client.send(getCommand);

    let existingData = "";
    for await (const chunk of readStream) {
      existingData += chunk.toString();
    }
    const newData = existingData + "\n" + logDump;

    const putCommand = new PutObjectCommand({
      ...input,
      Body: newData,
    });
    await client.send(putCommand);

    console.log("Log appended successfully");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Log appended successfully" }),
    };
  } catch (error) {
    // If the file does not exist, create it
    const putCommand = new PutObjectCommand({
      ...input,
      Body: logDump,
    });
    await client.send(putCommand);

    console.log("Log file created successfully");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Log file created successfully" }),
    };
  }
};
