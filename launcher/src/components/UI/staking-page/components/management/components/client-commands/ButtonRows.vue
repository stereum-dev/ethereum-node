<template>
  <div
    class="h-full col-start-1 col-span-full row-start-3 row-span-full flex flex-col justify-evenly items-center space-y-1 px-[2px]"
  >
    <div
      class="w-full h-5 bg-gray-300 rounded-full grid grid-cols-6 grid-rows-1 items-center px-1 hover:bg-[#336666] hover:text-gray-300 active:scale-95 text-gray-800 cursor-pointer transition-all duration-150 ease-in-out"
    >
      <img
        class="col-start-1 col-span-1 row-start-1 w-4"
        src="/img/icon/the-staking/option-graffiti.png"
        alt="Graffiti Icon"
      />
      <span class="col-start-2 col-span-full row-start-1 text-[10px] font-semibold text-center"
        >CHANGE ALL GRAFFITI</span
      >
    </div>
    <div
      class="w-full h-5 bg-gray-300 rounded-full grid grid-cols-6 grid-rows-1 items-center px-1 hover:bg-[#336666] hover:text-gray-300 text-gray-800 active:scale-95 cursor-pointer transition-all duration-150 ease-in-out"
    >
      <img
        class="col-start-1 col-span-1 row-start-1 w-4"
        src="/img/icon/the-staking/option-graffiti.png"
        alt="Graffiti Icon"
      />
      <span class="col-start-2 col-span-full row-start-1 text-[10px] font-semibold text-center">REMOVE ALL KEYS</span>
    </div>
    <div
      class="w-full h-5 bg-gray-300 rounded-full grid grid-cols-6 grid-rows-1 items-center px-1 hover:bg-[#336666] hover:text-gray-300 text-gray-800 active:scale-95 cursor-pointer transition-all duration-150 ease-in-out"
    >
      <img
        class="col-start-1 col-span-1 row-start-1 w-4"
        src="/img/icon/the-staking/withdraw.png"
        alt="Graffiti Icon"
      />
      <span class="col-start-2 col-span-full row-start-1 text-[9px] font-semibold text-center"
        >WITHDRAW & EXIT ALL KEYS</span
      >
    </div>
    <div
      class="w-full h-5 bg-gray-300 rounded-full grid grid-cols-6 grid-rows-1 items-center px-1 hover:bg-[#336666] hover:text-gray-300 text-gray-800 active:scale-95 cursor-pointer transition-all duration-150 ease-in-out"
    >
      <img
        class="col-start-1 col-span-1 row-start-1 w-4"
        src="/img/icon/the-staking/remotekey.svg"
        alt="Graffiti Icon"
      />
      <span class="col-start-2 col-span-full row-start-1 text-[10px] font-semibold text-center uppercase"
        >Import Remote Keys</span
      >
    </div>

    <!-- <div
      class="buttonRow4
      :class="{
        disabled:
          disable || validatorName === 'Lodestar' || validatorName === 'Nimbus' || validatorName === 'Web3Signer',
      }"
      @click.stop="$emit('clickBtnGraffiti')"
    >
      <div class="btnContent">
        <img src="/img/icon/the-staking/option-graffiti.png" alt="icon" />
        <span>{{ $t("selectionOption.graffiti") }}</span>
      </div>
    </div>
    <div class="buttonRow" :class="{ disabled: disable }" @click.stop="$emit('clickBtnRemove')">
      <div class="btnContent">
        <img src="/img/icon/the-staking/option-remove.png" alt="icon" />
        <span>{{ $t("selectionOption.removeKeys") }}</span>
      </div>
    </div>
    <div
      class="buttonRow"
      :class="{ disabled: validatorName === 'Web3Signer' }"
      @click.stop="$emit('importRemoteKeys')"
    >
      <div class="btnContent">
        <img src="/img/icon/the-staking/option-remove.png" alt="icon" />
        <span>Import Remote Keys</span>
      </div>
    </div> -->
  </div>
</template>
