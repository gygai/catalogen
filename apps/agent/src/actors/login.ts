async function* fakeLogin() {
    console.debug("say i do login");
    yield {type: "user.login", token: "fake token"};
}
 
export default fakeLogin