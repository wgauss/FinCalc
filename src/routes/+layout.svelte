<script lang="ts">
	import '../app.postcss';
	import { 
		AppShell, 
		initializeStores, 
		Modal,
		Toast

		
	} from '@skeletonlabs/skeleton';
	
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
			
	initializeStores();
</script>

<Toast/>

<Modal />

<AppShell>
	<slot />
</AppShell>
