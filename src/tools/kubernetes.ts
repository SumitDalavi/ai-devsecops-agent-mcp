import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Registers Kubernetes and SRE incident correlation tools with the MCP Server.
 */
export function registerK8sIncidentTools(server: McpServer) {
  
  server.tool(
    "get-kubernetes-events",
    "Fetches recent Kubernetes events for a specific namespace, crucial for correlating deployment failures, OOMKills, or pod scheduling issues.",
    {
      namespace: z.string().describe("The Kubernetes namespace to query (e.g., 'production', 'staging')"),
      limit: z.number().optional().describe("Maximum number of events to return (default: 50)")
    },
    async ({ namespace, limit = 50 }) => {
      // In a real implementation, this would use the Kubernetes Node.js client
      // e.g., k8sApi.listNamespacedEvent(namespace)
      
      console.log(`[Kubernetes Tool] Fetching recent events for namespace: ${namespace}`);
      
      const mockEvents = [
        {
          timestamp: new Date(Date.now() - 5000).toISOString(),
          type: "Warning",
          reason: "BackOff",
          object: "pod/payment-service-845b9d99c7-2rt4p",
          message: "Back-off restarting failed container"
        },
        {
          timestamp: new Date(Date.now() - 15000).toISOString(),
          type: "Warning",
          reason: "OOMKilled",
          object: "pod/payment-service-845b9d99c7-2rt4p",
          message: "Container payment-service failed with OOMKilled"
        },
        {
          timestamp: new Date(Date.now() - 45000).toISOString(),
          type: "Normal",
          reason: "ScalingReplicaSet",
          object: "deployment/payment-service",
          message: "Scaled up replica set payment-service-845b9d99c7 to 3"
        }
      ];

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ namespace, count: mockEvents.length, events: mockEvents }, null, 2)
          }
        ]
      };
    }
  );

  server.tool(
    "get-prometheus-metrics",
    "Fetches Prometheus metrics for SLI/SLO analysis, specifically error rates and latency spikes.",
    {
      service: z.string().describe("The service name to query metrics for"),
      metricType: z.enum(["error_rate", "latency", "cpu", "memory"]).describe("The type of metric to fetch"),
      timeWindowMinutes: z.number().optional().describe("Time window in minutes (default: 30)")
    },
    async ({ service, metricType, timeWindowMinutes = 30 }) => {
      // In a real implementation, this would query the Prometheus HTTP API
      // e.g., GET /api/v1/query_range?query=rate(http_requests_total{status=~"5.."}[5m])
      
      console.log(`[Prometheus Tool] Fetching ${metricType} metrics for service: ${service}`);
      
      let mockData: any = { service, timeWindowMinutes };
      
      if (metricType === "error_rate") {
        mockData.current_error_rate = "4.2%";
        mockData.slo_threshold = "1.0%";
        mockData.status = "BREACHED";
        mockData.trend = "increasing steeply over last 5 minutes";
      } else if (metricType === "memory") {
        mockData.usage_bytes = "1024000000";
        mockData.limit_bytes = "1024000000";
        mockData.status = "AT_LIMIT";
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(mockData, null, 2)
          }
        ]
      };
    }
  );
}
