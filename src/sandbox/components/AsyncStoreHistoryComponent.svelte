<script lang="ts">
	import { forecasts, forecastIndex, forecastHistory } from "$sandbox/stores/writableAsyncHistoric";
</script>

{#if typeof $forecasts === "undefined"}
	<p>Loading...</p>
{:else if $forecasts instanceof Error}
	<p style="color: crimson">{$forecasts.message}</p>
	<p>{$forecasts.stack}</p>
{:else}
	<table>
		<thead>
			<tr>
				<th>Date</th>
				<th>TemperatureC</th>
				<th>TemperatureF</th>
				<th>Summary</th>
			</tr>
		</thead>
		<tbody>
			{#each $forecasts as forecast}
				<tr>
					<td>{forecast.date}</td>
					<td>{forecast.temperatureC}</td>
					<td>{forecast.temperatureF}</td>
					<td>{forecast.summary}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<input type="text" bind:value={$forecasts[0].summary} />
	<button on:click={() => forecasts.undo()}>undo</button>
	<button on:click={() => forecasts.redo()}>redo</button>
	<button on:click={() => forecasts.refresh()}>refresh</button>
	<button on:click={() => forecasts.refresh(true)}>silent refresh</button>
	<p>Index: {$forecastIndex}</p>
	<ul>
		{#each $forecastHistory as item, i}
			<li style={i === $forecastIndex ? "color: crimson;" : ""}>{item[0].summary}</li>
		{/each}
	</ul>
{/if}
