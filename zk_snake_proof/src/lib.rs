#![no_std]
#![no_main]

extern crate alloc;
use core::panic::PanicInfo;
use alloc::vec::Vec;


#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;


#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    loop {}
}

#Проверка очков
#[no_mangle]
pub extern "C" fn verify_score(score: u32) -> u32 {
    if score > 0 {
        1 
    } else {
        0 
    }
}
