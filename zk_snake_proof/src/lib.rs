#![no_std]
#![no_main]

extern crate alloc;
use core::panic::PanicInfo;
use alloc::vec::Vec;

// Устанавливаем глобальный аллокатор (для работы с памятью)
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Хендлер паники (обязательно для no_std)
#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    loop {}
}

// 🟢 Функция проверки очков
#[no_mangle]
pub extern "C" fn verify_score(score: u32) -> u32 {
    if score > 0 {
        1 // True
    } else {
        0 // False
    }
}
