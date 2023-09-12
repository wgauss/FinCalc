<script lang="ts">
	import { 
		Accordion, 
		AccordionItem, 
		Table, 
		tableMapperValues,
		TabGroup, 
		Tab, 
		TabAnchor,
		ConicGradient,
		ProgressBar } from '@skeletonlabs/skeleton'
	
	import type { ConicStop } from '@skeletonlabs/skeleton';

	let tabSet: number = 0;


	import Icon from 'svelte-icons-pack';
	import FaSolidPiggyBank from "svelte-icons-pack/fa/FaSolidPiggyBank"
	import AiOutlineStock from "svelte-icons-pack/ai/AiOutlineStock";
	import FaSolidChartPie from "svelte-icons-pack/fa/FaSolidChartPie";
	import AiOutlineTable from "svelte-icons-pack/ai/AiOutlineTable";

	import { writable } from "svelte/store";

	const expenses = writable(0)

	const currency = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});

	const percent = Intl.NumberFormat('en-US', {
		style: 'percent',
		minimumFractionDigits: 2,
  		maximumFractionDigits: 2
	});


	const conicStops: ConicStop[] = [
		{ label: 'Assets', color: 'rgba(255,255,255,.78)', start: 0, end: 80 },
		{ label: 'Expenses', color: 'rgba(255,255,255,0.1)', start: 80, end: 100 }
	];

	var tableAssets = [
		{ position: 1, name: 'Savings Bank Account', amount:  20000 },
		{ position: 2, name: 'Cash', amount: 0 },
		{ position: 3, name: 'Gold (Ounce Troy)', amount: .13 },
		{ position: 4, name: 'Silver (Ounce Troy)', amount: 24 }
	]
	//ONCE THIS IS BEING CREATED, THERE SHOULD BE A FUNCTION THAT TIES THE POSITION OR ID TO TIE THE ASSET AMOUNT TO THE GOAL
	var tableAssetGoals = [ 
		{ position: 1, name: 'Savings Bank Account', amount:  50000, amountSaved: tableAssets[0].amount, type: "Dollar"},
		{ position: 2, name: 'Cash', amount: 10000, amountSaved: tableAssets[1].amount, type: "Dollar"},
		{ position: 3, name: 'Gold (Ounce Troy)', amount: 2, amountSaved: tableAssets[2].amount, type: "Quantity"},
		{ position: 4, name: 'Silver (Ounce Troy)', amount: 200, amountSaved:  tableAssets[3].amount, type: "Quantity"}
	]
			
	function mySelectionHandler(meta){
		console.log(meta.detail)
	}

	function renderTimeLeft(daTing){
		console.log()
		
		//this should return Tooltip x days
	}

</script>

<div class="flex justify-center items-center">
	<div class="xs:w-11/12 w-9/12">
		<div> <!-- put viewport here ( graph, pie chart ) -->
			<TabGroup>
				<Tab bind:group={tabSet} name="tab1" value={0}>
					<svelte:fragment slot="lead"> <Icon src={FaSolidChartPie} color="white" size="32px"/> </svelte:fragment>
				</Tab>
				<Tab bind:group={tabSet} name="tab2" value={1}>
					<Icon src={AiOutlineStock} color="white" size="32px"/>
				</Tab>
				<Tab bind:group={tabSet} name="tab2" value={2}>
					<Icon src={AiOutlineTable} color="white" size="32px"/>
				</Tab>
				
				<!-- Tab Panels --->
				<svelte:fragment slot="panel">
					{#if tabSet === 0}
						<ConicGradient stops={conicStops} legend width="xs:w-3/4 md:w-1/4"> Totals </ConicGradient>
					{:else if tabSet === 1}
						(tab panel 2 contents)
					{:else if tabSet === 2}
						(tab panel 3 contents)
					{/if}
				</svelte:fragment>
			</TabGroup>
			
		</div>
		<hr class="my-4"/>
		<div class="flex justify-center"> <!-- put glance shit here -->
			<div class="w-full">
				<Accordion>
					<AccordionItem open>
						<svelte:fragment slot="lead"> <Icon src={FaSolidPiggyBank} color="white" size="32px"/> </svelte:fragment>
						<svelte:fragment slot="summary">Assets | Total: </svelte:fragment>
						<svelte:fragment slot="content">

						<!-- Responsive Container (recommended) -->
						<div class="table-container">
							<!-- Native Table Element -->
							<table class="table table-interactive text-center">
								<thead>
									<tr >
										<th class="text-center">Asset Name</th>
										<th class="text-center">Amount</th>
									</tr>
								</thead>
								<tbody>
									{#each tableAssets as row}
										<tr>
											<td>{row.name}</td>
											<td>{currency.format(row.amount)}</td>
										</tr>
									{/each}
								</tbody>
								<tfoot>
									<tr >
										<td class="text-center" colspan="2">
											<button class="btn variant-filled rounded-full">
												Add Asset &nbsp; <strong class='text-[26px]'> + </strong> 
											</button>
										</td>
									</tr>
								</tfoot>
							</table>
						</div>

							<hr class="my-3"/>
							
							<div class="table-container">
								<!-- Native Table Element -->
								<table class="table table-interactive text-center">
									<thead>
										<tr >
											<th class="text-center">Goals</th>
											<th class="text-center">Goal Amount</th>
										</tr>
									</thead>
									<tbody>
										{#each tableAssetGoals as row}
											<tr>
												<td>{row.name}</td>
													<td on:mouseenter={() => renderTimeLeft(this)}>
														{#if row.type === "Dollar"}
															{currency.format(row.amountSaved)} / {currency.format(row.amount)} ( { percent.format(row.amountSaved / row.amount) } )<ProgressBar label="Progress Bar" value={row.amountSaved} max={row.amount} />
														{:else}
															{row.amountSaved} / {row.amount} ( { percent.format(row.amountSaved / row.amount) } ) <ProgressBar label="Progress Bar" value={row.amountSaved} max={row.amount} />
														{/if}
													</td>
												</tr>
										{/each}
									</tbody>
									<tfoot>
										<tr >
											<td class="text-center" colspan="2">
												<button class="btn variant-filled rounded-full">
													Add Goal &nbsp; <strong class='text-[26px]'> + </strong> 
												</button>
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
							
							<hr class="my-3"/>
						</svelte:fragment>
					</AccordionItem>
					<AccordionItem>
						<svelte:fragment slot="lead"><p class="text-[32px]">📉</p></svelte:fragment>
						<svelte:fragment slot="summary">Expenses | Total: </svelte:fragment>
						<svelte:fragment slot="content">
							<div class="bg-slate-800 rounded p-2 text-center">
								do work
							</div>
						</svelte:fragment>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	</div>
</div>

<!-- 
	idea:
		integrate a way to keep track of asset prices unit weight or quantity
		everytime you buy new quantity, just add more to unit weight or quantity and multiply that with the price, subtract the cost, output that
		graph profits https://data-asg.goldprice.org/dbXRates/USD

	on top of that we can have different views for each item

	At a glance {
		Assets{
			savings bank account
			cash
			metals
			(add button)
			____________________

			goals{
				<Progress Bar/> x%, date (Tooltip x days) $500
				(add button)
			}
		}
		Expenses{
			Debts {
				x <Progress Bar/> x%, date (Tooltip x days) $1500 (),
				y
			}
			(add button)
		}
		total since ( date )
	}

	Steps {
		bills
		income
		assets
		goals
	}

	flow should be as follows
	if (firstTime){
		askEm Questions or give them option to skip and add manually
	}

	if (localStorage){
		just display what they have
	}

	known variables

	Expenses {
		x itemized (categorized *should have a tree probs accordian*)
		EX:
		Needs (total) {
			Living Expenses {
				Rent
				Food
				Electric (etc)

			}
			Business Expenses {
				Rent
				Electric
			}
		}
		Wants {
			Car (payments, savings)
		}
		
	}

	payType = hourly || salary || contract (over a period of time)
	
	paySchedule = Daily || Weekly || Bi-Weekly || Monthly || x Months
	
	swtich(payType){
		case( hourly ){

		}
		case( salary ){

		}
		case( contract ){

		}
	}

	iteration 1:
		income * time - bills * time = leftover

		savings = leftover * savings percentage

		spendings = leftover * spendings percentage

		savings * item percentage (there should be a function to determine a date when you should have enough)

		itemGoalTimeCalc(){
			//returns goal date, subsequently the time left ( probably separate function )
			itemGoalPrice = x
			
			goalDate*time* = paySchedule * income
			 
		}

 -->