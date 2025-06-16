<template>
    <div class="flex items-center justify-center h-screen bg-oxford-blue">
        <div class="relative w-36 h-36">
            <!-- Outer Pulse Circle -->
            <div class="absolute inset-0 rounded-full border-4 border-chinese-bronze animate-ping opacity-30"></div>

            <!-- Spinning Gradient Ring -->
            <div class="absolute inset-0 rounded-full border-t-4 border-ocean-blue border-b-4 animate-spin"></div>

            <!-- Center Branding Logo -->
            <div class="absolute inset-4 flex items-center justify-center bg-oxford-blue rounded-full shadow-lg">
                <img
                    src="/portfolio_logo.svg"
                    alt="Loading Screen Logo"
                    class="rounded-full transition-all duration-300 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 xl:h-32 xl:w-32"
                />
            </div>
        </div>
    </div>
</template>
