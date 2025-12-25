```mermaid

sequenceDiagram

    participant Browser
    participant Server
    
    Not right of browser: When save button is pressed the browser invokes a callback funtion and post the contents to the address

    browser->>server: POST [{"content": "Bonjour", "date": "2025-1-1"}] https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: 201 status code created
    deactivate server

    Note right of browser: The browser then invokes a callback function and renders notes

```