
export type UserPost = {
    href: string
}
export async function* fakeGetUserPhotos({token} :{token:string}){
    console.debug("say i fetch user photos", token);
    yield {href: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"};
    yield {href: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"};
    await new Promise((resolve) => setTimeout(resolve, 1000));
    yield { href: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"};

}

export  default  fakeGetUserPhotos