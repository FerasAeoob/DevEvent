
async function test() {
    try {
        const tags = '["react", "node"]';
        const agenda = '["Introduction", "Main Session"]';
        
        console.log("Parsing tags:", tags);
        const parsedTags = JSON.parse(tags);
        console.log("Parsed tags successfully:", parsedTags);

        console.log("Parsing agenda:", agenda);
        const parsedAgenda = JSON.parse(agenda);
        console.log("Parsed agenda successfully:", parsedAgenda);

        // Simulate the error
        const malformed = '["tag1"] ["tag2"]';
        console.log("Parsing malformed:", malformed);
        JSON.parse(malformed);
    } catch (e) {
        console.error("Caught expected error:", e.message);
    }
}

test();
