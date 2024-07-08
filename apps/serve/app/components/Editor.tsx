import React, {useState, useRef, useEffect, useMemo} from "react";
import ReactQuill, { Quill } from "react-quill";
import { QuillBinding } from "y-quill";
import useYProvider from "y-partykit/react";
import "react-quill/dist/quill.snow.css";
import styles from "./Editor.module.css";
import QuillCursors from "quill-cursors";
import '@y-block/gallery';
import {connectFakeStore} from "@y-block/gallery";
 import * as Y from 'yjs'; 
export default function Editor({
  room,
  userColor,
}: {
  room: string;
  userColor: string;
}) {
  // const [items, setItems] = useState<Y.Array<any>>();

  const doc= useMemo(() => new Y.Doc(), []);
  const items= useMemo(() => connectFakeStore(doc), [doc]);
   const ref= useRef()
  const provider = useYProvider({
    doc,
    room,
  });
  useEffect(() => {
     console.log("items", items?.toJSON()) 

    provider.awareness.setLocalStateField("user", {
      name: "Typing...",
      color: userColor,
    }); 
  }, [userColor, provider]);

  useEffect(() => {
    console.log("items:wd", items?.toJSON())
     if( ref.current   )
         ref.current.items = items;
  }, [items, ref.current]);

  return (
      <div className="container mx-auto ">
        <y-gallery id="gallery" items={items} ref={ref}>
          <product-card></product-card>
        </y-gallery> 
        
      </div>
  );
}

 