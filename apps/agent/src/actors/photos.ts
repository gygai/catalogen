import * as Y from "yjs";
export type UserPost = {
     caption?: string;
        media_type?: string;
        media_url: string;
    id: number;

}
export async function* fakeGetUserPhotos({token} :{token:Y.Text}):AsyncGenerator<UserPost>{
    console.debug("say i fetch user photos", token);
    yield   {
        id:0,
        "caption": "\u05e2\u05dd \u05d4\u05d9\u05e4\u05d4 \u05d1\u05d0\u05d3\u05dd",
        "media_type": "IMAGE",
        "media_url": "https://scontent.cdninstagram.com/v/t51.2885-15/26867957_1961814687479584_7530396392351596544_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=18de74&_nc_ohc=LJ8dIEJ2g5AQ7kNvgFtgS--&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AYCifwLkuhiJOJ3W5-lpSjEZ7MWDK3BXS6yt2jHJE2QuSg&oe=669F53AC"
    };
        yield   {
        id:1,
        "caption": "\u05e0\u05e2\u05d4 \ud83d\ude17",
        "media_type": "CAROUSEL_ALBUM",
        "media_url": "https://images.unsplash.com/photo-1622436023208-b863dd77743f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHN0eWxpc2glMjBnaXJsfGVufDB8fDB8fHww"
    },
            yield   {
                id: 2, 
                "caption": "\u05e0\u05e2\u05d4 \ud83d\ude17",
                "media_type": "CAROUSEL_ALBUM",
                "media_url": "https://plus.unsplash.com/premium_photo-1685125885138-652f2ede6ab9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
    await new Promise((resolve) => setTimeout(resolve, 500));

    yield   {
                id: 3, 
                "caption": "\u05e0\u05e2\u05d4 \ud83d\ude17",
                "media_type": "CAROUSEL_ALBUM",
                "media_url": "https://images.unsplash.com/photo-1578979879663-4ba6a968a50a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3R5bGlzaCUyMGdpcmx8ZW58MHx8MHx8fDA%3D"
            }
            
            yield   {
                id: 4, 
                "caption": "\u05e0\u05e2\u05d4 \ud83d\ude17",
                "media_type": "CAROUSEL_ALBUM",
                "media_url": "https://images.unsplash.com/photo-1568196004494-b1ee34f3b436?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3R5bGlzaCUyMGdpcmx8ZW58MHx8MHx8fDA%3D"
            }
            yield   {
                id: 5, 
                "caption": "\u05e0\u05e2\u05d4 \ud83d\ude17",
                "media_type": "CAROUSEL_ALBUM",
                "media_url": "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3R5bGlzaCUyMGdpcmx8ZW58MHx8MHx8fDA%3D"
            }
    
  

}

export  async function* getInstagramPosts({token} :{token:Y.Text}):AsyncGenerator<UserPost>{
    if(!token.length){
        yield *fakeGetUserPhotos({token});
    }
    else {
        try {
            const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url&access_token=${token.toJSON()}`);
            const responseJson = await response.json();
            console.debug("response", responseJson);
            for (const post of responseJson.data) {
                yield post;
                //animate
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
            //pagination
            if (responseJson.paging?.next) {
                const nextUrl = responseJson.paging.next;
                console.debug("fetching next page", nextUrl);
                const nextResponse = await fetch(nextUrl);
                const nextResponseJson = await nextResponse.json();
                for (const post of nextResponseJson.data) {
                    yield post;
                    //animate
                    await new Promise((resolve) => setTimeout(resolve, 500));
                } 
            }
            
        } catch (e) {
            console.error("error fetching instagram posts", e);
            yield* fakeGetUserPhotos({token});
        }
    }
}

export  default  fakeGetUserPhotos