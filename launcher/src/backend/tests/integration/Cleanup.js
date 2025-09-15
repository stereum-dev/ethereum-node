import axios from "axios";

async function cleanup() {
  const apiToken = process.env.HCLOUD_TOKEN;
  if (!apiToken) {
    console.error("HCLOUD_TOKEN environment variable is not set.");
    return;
  }

  const config = {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  };

  // Cleanup servers with names containing "integration-test"
  try {
    const response = await axios.get("https://api.hetzner.cloud/v1/servers", config);
    const servers = response.data.servers;
    let currentPage = response.data.meta.pagination.page + 1;
    const lastPage = response.data.meta.pagination.last_page;

    while (currentPage <= lastPage) {
      const pagedResponse = await axios.get(`https://api.hetzner.cloud/v1/servers?page=${currentPage}`, config);
      servers.push(...pagedResponse.data.servers);
      currentPage++;
    }

    const integrationTestServers = servers.filter((server) => server.name.includes("integration-test"));

    for (const server of integrationTestServers) {
      try {
        await axios.delete(`https://api.hetzner.cloud/v1/servers/${server.id}`, config);
        console.log(`Deleted server: ${server.name} (ID: ${server.id})`);
      } catch (deleteError) {
        console.error(`Failed to delete server: ${server.name} (ID: ${server.id})`, deleteError);
      }
    }

    if (integrationTestServers.length === 0) {
      console.log("No integration-test servers found.");
    }
  } catch (error) {
    console.error("Error fetching servers:", error);
  }

  // Cleanup SSH keys with names containing "integration-test"
  try {
    const response = await axios.get("https://api.hetzner.cloud/v1/ssh_keys", config);
    const sshKeys = response.data.ssh_keys;
    let currentPage = response.data.meta.pagination.page + 1;
    const lastPage = response.data.meta.pagination.last_page;

    while (currentPage <= lastPage) {
      const pagedResponse = await axios.get(`https://api.hetzner.cloud/v1/ssh_keys?page=${currentPage}`, config);
      sshKeys.push(...pagedResponse.data.ssh_keys);
      currentPage++;
    }

    const integrationTestKeys = sshKeys.filter((key) => key.name.includes("integration-test"));

    for (const key of integrationTestKeys) {
      try {
        await axios.delete(`https://api.hetzner.cloud/v1/ssh_keys/${key.id}`, config);
        console.log(`Deleted SSH key: ${key.name} (ID: ${key.id})`);
      } catch (deleteError) {
        console.error(`Failed to delete SSH key: ${key.name} (ID: ${key.id})`, deleteError);
      }
    }

    if (integrationTestKeys.length === 0) {
      console.log("No integration-test SSH keys found.");
    }
  } catch (error) {
    console.error("Error fetching SSH keys:", error);
  }
}

cleanup();
