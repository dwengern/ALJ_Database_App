<script lang="ts">
  import { page } from "$app/stores"
	import { callSignInWithPopup, callSignOut } from '$lib/sign-in-popup';
	import { browser } from '$app/environment';
	import 	{ sharedState, updateUser } from '$lib/sharedState.svelte';

	function doLogin() {
        if (!sharedState!.auth) {
            console.log('No auth object');
            return;
        }
		callSignInWithPopup(sharedState!.auth);
	}

	function doLogout() {
        if (!sharedState!.auth) {
            console.log('No auth object');
            return;
        }
		callSignOut(sharedState.auth);
	}

  const navs = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Search",
      href: "/search",
    },
    {
      title: "Conversations",
      href: "/conversations"
    }, 
	{
	  title: "Communitiies", 
	  href: "/communities"
	}
  ];

  let url = $derived($page.url.href)
  let routeId = $derived($page.url.pathname);
</script>

<nav>
	<div class="container">
		<ul>
			{#each navs as { title, href }}
				<li>
					<a {href} class:active={href === '/' ? routeId === '/' : url.includes(href)} {title}
						>{title}</a
					>
				</li>
			{/each}
				{#if browser}
					{#if sharedState.user.name.length == 0}
					<li>
						<a href="#top" onclick={doLogin}>Sign In</a>
					</li>
					{:else}
						<li>
							<a href="/uid/profile">View Profile</a>
						</li>
						<li>
							<a href="/editmyprofile">Edit Profile</a>
						</li>
						<li>
							<a href="#top" onclick={doLogout}>Sign Out</a>
						</li>
					{/if}
				{:else}
					No browser
				{/if}
		</ul>
	</div>
</nav>

<style>
	nav {
		padding: 0.5em;
		background-color: #343a40;
		color: white;
	}

	.container {
		display: flex;
		align-items: center;
	}

	ul {
		display: flex;
		margin: 0;
		margin-left: auto;
		list-style: none;
		font-size: 1em;
	}
	li {
		margin-right: 20px;
	}
	a {
		text-decoration: none;
		color: #aaa;
	}
	.active {
		color: white;
	}

	nav {
    padding: 0.5em;
    background-color: #343a40;
    color: white;
  }

  .container {
    display: flex;
    align-items: center;
  }

  ul {
    display: flex;
    margin: 0;
    margin-left: auto;
    list-style: none;
    font-size: 1em;
  }
  li {
    margin-right: 20px;
  }
  a {
    text-decoration: none;
    color: #aaa;
  }
  .active {
    color: white;
  }
</style>
