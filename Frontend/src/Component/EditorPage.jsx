import React, { useEffect, useRef, useState } from 'react';

import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import './nameStyle.css'

function EditorPage({ socketRef, meetingID ,onCodeChange,language }) {
  const [code, setCode] = useState(`// Welcome To Coder'$ Gyan`);
  const editorRef = useRef(null);
  const isRemoteUpdate = useRef(false);
  
 // const userCursorsRef = useRef({}); 
  console.log(language +" language yeh aaraha hai hai ")
  const editorOptions = {
    fontSize: 18,
    wordWrap: 'on',
    lineHeight: 24,
  };

  // Called when editor mounts
  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    // Listen for local changes
    editor.onDidChangeModelContent(() => {

      if(isRemoteUpdate.current){
        isRemoteUpdate.current=false;
        return ;
      }

      const updatedCode = editor.getValue();
      onCodeChange(updatedCode);
      socketRef.current.emit('code-change', { code: updatedCode, meetingID });
    });

    // Inside EditorPage, after editorRef is available
    // editor.onDidChangeCursorSelection((e) => {
    //   const position = e.selection.getPosition();
    //   socketRef.current.emit('cursor-position', {
    //    // socketID:socketRef.current.id,
    //     position,
    //     meetingID,
    //   });
    // });
    //  // ✅ Handle incoming remote cursor positions
    //  socketRef.current.on('cursor-position', ({ username, socketID, position }) => {

    //    if (socketID === socketRef.current.id) return; // Don't show for self
    //    console.log(username +" ha yeh username hai ")

    //   const range = new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column);
    //   const decoration = {
    //     range,
    //     options: {
    //       className: 'border-l-2 border-yellow-400',
    //       after: {
    //         content: `👤 ${username}`,
    //         inlineClassName: 'text-xs bg-yellow-400 text-black px-1 rounded absolute mt-[-1.5rem] ml-1 z-50',
    //       },
    //     },
        
    //   };

    //   // Remove old decoration for this user
    //   const oldDecorations = userCursorsRef.current[socketID] || [];
    //   const newDecorations = editor.deltaDecorations(oldDecorations, [decoration]);
    //   userCursorsRef.current[socketID] = newDecorations;
    // });
  };

 

  useEffect(() => {

    console.log("I am come in")
    if (!socketRef.current) return;

    // Receive code changes from other users
    const handleCodeChange = ({ code }) => {
      console.log(code)
      const editor = editorRef.current;
      if (editor && code !== editor.getValue()) {
        isRemoteUpdate.current = true;
        editor.setValue(code);
      }
    };

    socketRef.current.on('code-change', handleCodeChange);

    return () => {
      socketRef.current.off('code-change', handleCodeChange);
    };
  }, [socketRef.current]);

  

  
  
  

  return (
    <Editor
      height="100vh"
      width="65vw"
      language={language}
      value={code}
      options={editorOptions}
      onMount={handleEditorMount}
      theme="vs-dark"
    />
  );
}

export default EditorPage;
//rohit
