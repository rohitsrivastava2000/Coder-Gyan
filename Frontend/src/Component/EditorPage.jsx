import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';

function EditorPage({ socketRef, meetingID ,onCodeChange }) {
  const [code, setCode] = useState(`// Welcome To Coder'$ Gyan`);
  const editorRef = useRef(null);
  const isRemoteUpdate = useRef(false);


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
      defaultLanguage="javascript"
      value={code}
      options={editorOptions}
      onMount={handleEditorMount}
      theme="vs-dark"
    />
  );
}

export default EditorPage;
