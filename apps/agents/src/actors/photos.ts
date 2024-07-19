
export type UserPost = {
     caption?: string;
        media_type?: string;
        media_url: string;
    id: number;

}
export async function* fakeGetUserPhotos({token} :{token:string}):AsyncGenerator<UserPost>{
    console.debug("say i fetch user photos", token);
    /*https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url&access_token=${token} */
  /*  {
        "id": "17922013819017651",
        "caption": "\u05e2\u05dd \u05d4\u05d9\u05e4\u05d4 \u05d1\u05d0\u05d3\u05dd",
        "media_type": "IMAGE",
        "media_url": "https://scontent.cdninstagram.com/v/t51.2885-15/26867957_1961814687479584_7530396392351596544_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=18de74&_nc_ohc=LJ8dIEJ2g5AQ7kNvgFtgS--&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AYCifwLkuhiJOJ3W5-lpSjEZ7MWDK3BXS6yt2jHJE2QuSg&oe=669F53AC"
    },
    {
        "id": "17885466733102590",
        "caption": "\u05e0\u05e2\u05d4 \ud83d\ude17",
        "media_type": "CAROUSEL_ALBUM",
        "media_url": "https://scontent.cdninstagram.com/v/t51.2885-15/21373635_1724828124480039_3236284215750295552_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=18de74&_nc_ohc=rJrkiLkmGlQQ7kNvgH2Omme&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AYDcIA56zUz_bIaWB38tD7GGsULQmTo2Ysk764WAj1aGtQ&oe=669F2B83"
    },*/
    yield {media_url: "https://scontent.cdninstagram.com/v/t51.2885-15/26867957_1961814687479584_7530396392351596544_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=18de74&_nc_ohc=LJ8dIEJ2g5AQ7kNvgFtgS--&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AYCifwLkuhiJOJ3W5-lpSjEZ7MWDK3BXS6yt2jHJE2QuSg&oe=669F53AC", id:0};
    yield {media_url: "https://scontent.cdninstagram.com/v/t51.2885-15/21373635_1724828124480039_3236284215750295552_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=18de74&_nc_ohc=rJrkiLkmGlQQ7kNvgH2Omme&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AYDcIA56zUz_bIaWB38tD7GGsULQmTo2Ysk764WAj1aGtQ&oe=669F2B83", id:1};
    await new Promise((resolve) => setTimeout(resolve, 1000));
    yield { media_url: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg", id:2};

}

export  default  fakeGetUserPhotos