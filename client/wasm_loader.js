async function loadWASM() {
    console.log("⏳ Загружаем WASM...");
    
    try {
        const response = await fetch("zk_snake_proof.wasm");

        if (!response.ok) {
            throw new Error(`Ошибка загрузки WASM: ${response.status} ${response.statusText}`);
        }

        const { instance } = await WebAssembly.instantiateStreaming(response);

        if (!instance.exports.verify_score) {
            throw new Error("❌ Функция verify_score не найдена в WASM.");
        }

        // ✅ Экспортируем функцию в глобальную область видимости
        window.verify_score = instance.exports.verify_score;
        
        console.log("✅ WASM загружен успешно!");
        console.log("🚀 WASM готов к работе!");
    } catch (error) {
        console.error("❌ Ошибка при загрузке WASM:", error);
    }
}

// Запускаем загрузку WASM
loadWASM();
