const API_URL = "/chat";

async function sendMessage() {
    const input = document.getElementById("promptBox");
    const text = input.value.trim();

    if (!text) return;

    input.value = "";
    showMessage("user", text);

    const loading = showMessage("bot", "NEXORA is thinking...");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Request failed");
        }

        showMessage("bot", data.reply || "No reply received.");
    } catch (error) {
        console.error("NEXORA error:", error);
        showMessage("bot", "AI connection failed. Please try again.");
    }
}
