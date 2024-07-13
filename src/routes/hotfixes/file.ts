import app from "../..";
import hotfixes from "../../database/models/hotfixes";
import Tokens from "../../database/models/tokens";
import { Solara } from "../../utils/errors/Solara";
import { conf } from "../../../config/SolaraConfiguration";

export default function () {
    app.get("/fortnite/api/cloudstorage/system/:file", async (c, next) => {
        try {
            const csFile = await hotfixes.findOne({ method: "cloudstorage" });
            const file = c.req.param("file");

            if (!csFile) {
                return c.json([]);
            }

            const fileData = csFile.rows.find((row: any) => row.name === c.req.param("file"));

            if (!fileData) {
                return c.json([]);
            }

            const dataValues = Object.values(fileData.data).map((value) =>
                typeof value === "string" ? value : ""
            );
            let output = dataValues.join("");

            if (file === "DefaultGame.ini") {
                output += `
            
[VoiceChatManager]
bEnabled=true
bEnableOnLoadingScreen=false
bObtainJoinTokenFromPartyService=true
bAllowStateTransitionOnLoadingScreen=false
MaxRetries=5
RetryTimeJitter=1.0
RetryTimeBase=3.0
RetryTimeMultiplier=1.0
MaxRetryDelay=240.0
RequestJoinTokenTimeout=10.0
JoinChannelTimeout=120.0
VoiceChatImplementation=EOSVoiceChat
NetworkTypePollingDelay=0.0
PlayJoinSoundRecentLeaverDelaySeconds=30.0
DefaultInputVolume=1.0
DefaultOutputVolume=1.0
JoinTimeoutRecoveryMethod=Reinitialize
JoinErrorWorkaroundMethod=ResetConnection
NetworkChangeRecoveryMethod=ResetConnection
bEnableBluetoothMicrophone=false
VideoPreferredFramerate=0
bEnableEOSReservedAudioStreams=true

[VoiceChat.EOS]
bEnabled=true

[VoiceChat.Vivox]
bEnabled=true
ServerUrl=${conf.SERVERURL}
ServiceUrl=${conf.SERVERURL}
Domain=${conf.DOMAIN}
Issuer=${conf.ISSUER}
Key=${conf.SECRET}
SecretKey=${conf.SECRET}
      
[EOSSDK]
ProductName=VoicePlugin
ProductVersion=0.1
ProductId=${conf.PROD_ID}
SandboxId=${conf.SANDBOX_ID}
DeploymentId=${conf.DEPLOYMENT_ID}
ClientId=${conf.CLIENT_ID}
ClientSecret=${conf.CLIENT_SECRET}
      `;
            }


            c.header("Content-Type", "text/plain");
            return c.body(output);
        } catch (error) {
            console.error("Error retrieving file:", error);
            return c.body("Internal Server Error");
        }
    })
}