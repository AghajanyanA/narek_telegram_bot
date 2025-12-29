export function extractJsonFromHtmlScript(html: string): any | null {
    const scriptStart = html.indexOf(
        '<script type="application/json" class="state-view">'
    );
    if (scriptStart === -1) return null;
    const jsonStart = html.indexOf(">", scriptStart) + 1;
    const scriptEnd = html.indexOf("</script>", jsonStart);
    if (scriptEnd === -1) return null;
    const jsonString = html.slice(jsonStart, scriptEnd).trim();
    try {
        return JSON.parse(jsonString);
    } catch (err) {
        console.error("❌ Failed to parse embedded JSON:", err);
        return null;
    }
}
