<!-- 
	let tableAssets = ([
	{ position: 1, name: 'Savings Bank Account', amount:  20000 , type: "Dollar"},
	{ position: 2, name: 'Cash', amount: 0 , type: "Dollar"},
	{ position: 3, name: 'Gold (Ounce Troy)', amount: .13 , type: "Quanitity"},
	{ position: 4, name: 'Silver (Ounce Troy)', amount: 24 , type: "Quanitity"}
])
 -->

<script lang="ts">
	import Icon from 'svelte-icons-pack';
	import BsCurrencyDollar from "svelte-icons-pack/bs/BsCurrencyDollar";
	import AiTwotoneCheckCircle from "svelte-icons-pack/ai/AiTwotoneCheckCircle";
	import AiTwotoneExclamationCircle from "svelte-icons-pack/ai/AiTwotoneExclamationCircle";
	import AiOutlineFieldNumber from "svelte-icons-pack/ai/AiOutlineFieldNumber";
	import { SlideToggle, getModalStore, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton'
	
	import { fade } from 'svelte/transition';
	import { addAsset } from '../Utils/addAsset';
	
	const toastStore = getToastStore()
	const modalStore = getModalStore()

	let type: boolean = false, available: boolean = true, assetName: string, assetValue: string, assetType: string


	function checkAvailability(){
		//available = false
	}
	
	function handleAddAsset(){
		addAsset({assetName,assetValue, assetType })
		const toasty: ToastSettings = {
			message: "Added" /* + VARIABLE! */,
			background: 'variant-filled-success',
		}
		toastStore.trigger(toasty)
		//use localStore to add the asset to the already existing array
		modalStore.close()
	}
	
	

</script>
<div class="bg-black p-1 rounded">
		<div class="flex justify-center">
			<div class="w-11/12 space-y-6 my-4">
				<p class="text-2xl ">Add Asset</p>
				{#if available}
					
				{:else}
					<div in:fade={{duration: 300}} out:fade={{duration: 200}}>
						{ assetName } is already on the list!
					</div>
				{/if}
				<div class="input-group input-group-divider grid-cols-[1fr_auto]">
					<input type="text" placeholder="Name" on:change = {() => checkAvailability()} bind:value={assetName}/>
					<!-- add logic to check if the name is already in the list -->
					<div>
						{#if available}
							<Icon src={AiTwotoneCheckCircle} color="lime" size="32px"/>
						{:else}
							<Icon src={AiTwotoneExclamationCircle} color="lime" size="32px"/>
						{/if}
					</div>
				</div>
				
				<div class="flex">
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim flex justify-center">
							{#if type}
							<Icon src={AiOutlineFieldNumber} color="white" size="32px"/>
							{:else}
								<Icon src={BsCurrencyDollar} color="white" size="32px"/>					
							{/if}
						</div>
						<input type="text" placeholder="Amount" bind:value={assetValue} />
						
					</div>
					<div class="xs:ml-2 mt-1">
						<SlideToggle name="type" bind:checked = {type}>
							{#if type}
								Quantity 
							{:else}
								Dollar	
							{/if}
						</SlideToggle>
					</div>
				</div>
				{#if type}
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<input type="text" placeholder="Units (ex: grams (g), troy ounce (ozt), etc... )"/>
				</div>
				{/if}

		<div class="flex justify-around">
			<button class="btn variant-filled-error" on:click={() => modalStore.close()}>Cancel</button>
			<button class="btn variant-filled-success" on:click={() => handleAddAsset()} disabled={!available}>Add Asset</button>
		</div>
			</div>
		</div>
</div>