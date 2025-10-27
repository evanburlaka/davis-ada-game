(function () {
    if(window.Narrator) return;

    function isSupported() {
        return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    }

    var enabled = false;
    try {
        enabled = localStorage.getItem('stormwater_narrator_enabled') == '1';
    } catch (_) {}

    var voice = null;
    function pickVoice() {
        var list = window.speechSynthesis.getVoices() || [];
        for (var i = 0; i < list.length; i++) if (/en/i.test(list[i].lang)) return list[i];
    }

    function speak(text) {
        if (!enabled || !isSupported() || !text) return;
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(String(text));
        if (!voice) voice = pickVoice();
        if (voice) u.voice = voice;
        window.speechSynthesis.speak(u);
    }

    function stop() {
        try {
            window.speechSynthesis.cancel();
        } catch (_) {}
    }

    function setEnabled(v, announce) {
        enabled = !!v;
        localStorage.setItem('stormwater_narrator_enabled', enabled ? '1' : '0');
        button.setAttribute('aria-pressed', enabled);
        if (announce) speak(enabled ? 'Narrator on' : 'Narrator off');
    }

    var button = document.createElement('button');
    button.className = 'narrator-toggle';
    button.innerHTML = '<span class = "dot"></span> Narrator';
    button.onclick = function () {
        setEnabled(!enabled, true);
    };
    document.addEventListener('keydown', e => {
        if (e.shiftKey && (e.key == 'n' || e.key == 'N')) setEnabled(!enabled, true);
    });

    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(button);
        if (isSupported()) voice = pickVoice();
        if (enabled) speak('Narrator ready');
    });

    window.Narrator = {get enabled() { return enabled; }, speak, stop};
})();