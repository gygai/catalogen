import {ButtonHTMLAttributes, component$, Slot} from "@builder.io/qwik";
import {CatalogService, CatalogState} from "agent";
// import { useSignIn } from '~/routes/plugin@auth';
import {useAuthorizeUrl} from "~/routes/layout";

 

export const FakeLogin = component$((({store}:{store:{service:CatalogService | undefined, state:CatalogState}}) => {
    return (
        <Button
            onClick$={() => store.service!.send({type: "user.login", token: "fake token"})}
            disabled={!store?.service}
            hidden={store?.state !== 'idle' } 
        >Try it now</Button>
    );
}));

export const Button = component$((props:ButtonHTMLAttributes<any>) => {
    return <button {...props} class="rounded-full outline p-5 ml-5 outline-white shadow-2xl animate-pulse"  ><Slot/></button>
});



 

export const InstagramLoginManual =component$((({store:{state}}:{store:{ state:CatalogState}}) => {
    
     const authorizeUrl =  useAuthorizeUrl();
      return ( 
            <a href={authorizeUrl.value} class={"rounded-full outline p-5 ml-5 outline-white shadow-2xl animate-pulse"} hidden={state !== 'idle' } > 
                <span class="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#c13584]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path
                          d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                        </svg>
                 </span>

                {/*<img  class={" object-scale-down max-h-16 opacity-80"} */}
                {/*      */}
                {/*      src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAY1BMVEX///8AAACqqqrl5eXx8fH8/Pz29vbs7OxHR0f5+fnp6em0tLTc3Ny6uro7OzvS0tLMzMxaWloxMTF/f3+hoaHCwsKNjY0MDAwiIiJwcHBPT082NjYWFhZCQkJra2thYWGVlZXWxaRBAAAE60lEQVRogbWZi3KrIBBAUXkENVGTGJPGNv3/r7wsqOFpEG93ptOJwBGXfQEIExSUtbaILnitOYL9cXioOYr9cbi/OZL9cbivGUeiQ8PJSjMhRXPMI+TYFMiFG0CLjvOfexYt9+6KV9jmz/aVbUArebRreloe1Icsew5b4dl4qMNKRhQ0jfhDdDyLv8Otauvio9RtdTvMs+fTcjlsEM56pY/vink7BIRV30r5PePBTjSXfb6aLWQl9ZccmtNAO2eKfdyOBjkqul8pE/tUh17+QXB9knTmo5cttHVlWSSxWVGWHRB6n9rxCGxWFJvWUptcUUj66PtysMFTWeBErSg6aObhNtXwSXWZOm9FLxXFaQFPqITi0tlAZxX4n/0cVvMLUcnmsZFcF7mMJUXC3ofWansJn18LDity/Hnl7yGNq3WcPbNv7ecG+kM69fs3RAIzAuf3Iav0l0XTpXcMY748AK1f9R7kRzwx7CSafgP2M3stDxi4C9Gz3N1Z41j6L7CH7Of9RNjdXcvPqBBvu1mjXDqrhdh+UEu2Hu3gWwqtsoAlrqxRZv5neXdWKeHc5cYLfjPLPkDpjVYTQbi0jVOfez8nm0kOvTaF+vdmjG2nsC2GS0LuddqZ3pzclHlq7AksAiEgV++VjblUU4B+UbjhcLlW1fVymJL3I8CWC5hrv0Nw8XKmpt31yxLgvlOTx36Tioaj+ikd0NKZypijR5ObZj6KuOAakjKJ7OmNz9Fw0MnTO8EaXnvaA4egNLoNhApdMyhxLunwRuUVu5qmHHE+5S5PiRMJP02OaxoF4ZwizJXePYqJg/dLoDboHFEMqkGQdbLeGRYHP7z9VqcTMWlKoXCtfQkzDi4D8/xDo3NKiYKjzk4D0fDc+Oh5VYU6KBiLzOK9xYmHi2kN7raLEkw55lR+CR60j9sEP/sUSjgRKWypysSynFPgzOMjQtdi0pgs8ItH6THw2s7iyvworOVSyF49iSAWbkYsoqwE07flVP8NLnyeEor0MngPXFcL6JuAsejemqoWa0HlIorNmlm+py6oZYrSd7iub5BUUzSdSOqaEmu/k+5EmvsTcErh8ZNfvuuZZPefAxcBnQjXoXy274WeHrimkCvCCAGlEE3dk7Z2hNwpWVCJp6Z9q7nvSRZTmhN0+HTTTmDuu9LcnKAFHVNqG8reBC19ZGRAd+u24rmvtFCKEVUbpQ58f1EE5dz5z8q5vy1E/7CEXiv+L0uHMJzP8P+/bUEqH+7acNkyb7jk+TlHga2iPqnwVtGZ+7RVVK8V9B2bXLej2uRqu9z07bnbVW7P3w8petmBedORi6lAmQb0wrWylL7tOMfoDqicmq8bUg9z7AFwmGOdlL3Owzt8bmZrQ5rMzdltdl/OktwQGEOf/n/5gjy4yZGuHFFHCGX0mBkHXpPMh5Yps56EBA8t5+PWdDjFweNWxGFH3LGySDzMpUXBIBbffZpl8xF32okrXY64fd/O5sP5DXdbOpzNh/PeL2fsKsOeJ2PGiMyqWY4DcyvZ/guRsC0z1o6yT+pVTstWxrESC4scIEumXELhMsBWquLy+uy8/fZMzKaeEvLK1RySF3+bpWsCMPcnq16brixzqy5Zuw6V37fhshU5pr16kbst7HrGr15By4ojnf3h8jyeHhq/du0fSw+PJ2v50t6p+BErTf8Ay+cyi72Y6YsAAAAASUVORK5CYII="} />*/}
            </a>
    );
}));

//https://api.instagram.com/oauth/authorize?scope=user_profile%2Cuser_media&response_type=code&client_id=362485702774061&redirect_uri=https%3A%2F%2Flocal.pyzlo.com%2Fauth%2Fcallback%2Finstagram&code_challenge=YnxuhgfaSBp-KQaz-_S35XIRUO0UIp6eGMncfexoWIQ&code_challenge_method=S256

 
     
     