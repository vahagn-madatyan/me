export interface Architecture {
  title: string;
  description: string;
  domain: "distributed-systems" | "security" | "data-pipeline" | "infrastructure";
  image: string;
  problemSolved: string;
  techDecisions: string[];
}

export const architectures: Architecture[] = [
  {
    title: "Event-Driven Order Pipeline",
    description:
      "Asynchronous order processing system handling 50k+ events/sec with exactly-once delivery guarantees and automatic dead-letter recovery.",
    domain: "distributed-systems",
    image: "/diagrams/event-pipeline.png",
    problemSolved:
      "Replaced a synchronous REST chain that collapsed under peak traffic with a partitioned event bus that scales horizontally and recovers from partial failures without data loss.",
    techDecisions: ["Kafka", "Avro", "Kubernetes", "Go"],
  },
  {
    title: "Zero-Trust Service Mesh",
    description:
      "mTLS-enforced service mesh with dynamic policy evaluation at the sidecar layer. All inter-service traffic encrypted and authorized per-request.",
    domain: "security",
    image: "/diagrams/zero-trust-mesh.png",
    problemSolved:
      "Eliminated implicit trust between microservices by embedding identity verification and fine-grained authorization into the network layer — no application code changes required.",
    techDecisions: ["Envoy", "SPIFFE", "OPA", "Rust"],
  },
  {
    title: "Real-Time Feature Store",
    description:
      "Dual-layer feature store combining batch-computed features in a columnar store with sub-10ms online serving through a Redis-backed hot cache.",
    domain: "data-pipeline",
    image: "/diagrams/feature-store.png",
    problemSolved:
      "Unified offline training and online inference feature access behind a single API, eliminating the train/serve skew that caused silent model degradation in production.",
    techDecisions: ["Apache Spark", "Redis", "Protobuf", "Python"],
  },
  {
    title: "GitOps Deployment Platform",
    description:
      "Declarative infrastructure platform where every environment change flows through Git. Automated drift detection with self-healing reconciliation loops.",
    domain: "infrastructure",
    image: "/diagrams/gitops-platform.png",
    problemSolved:
      "Replaced manual kubectl-and-SSH deployments with a fully auditable, rollback-capable pipeline where the Git repo is the single source of truth for cluster state.",
    techDecisions: ["ArgoCD", "Terraform", "Helm", "GitHub Actions"],
  },
  {
    title: "Distributed Tracing Backbone",
    description:
      "Unified observability pipeline correlating traces, metrics, and logs across 200+ services with adaptive sampling that keeps costs predictable at scale.",
    domain: "infrastructure",
    image: "/diagrams/tracing-backbone.png",
    problemSolved:
      "Transformed debugging from log-grepping across dozens of services into single-click trace inspection, cutting mean-time-to-diagnose from hours to minutes.",
    techDecisions: ["OpenTelemetry", "Jaeger", "ClickHouse", "Go"],
  },
  {
    title: "Stream Processing DAG",
    description:
      "Composable stream processing framework that lets teams define transformation DAGs in YAML. Handles backpressure, checkpointing, and exactly-once semantics transparently.",
    domain: "data-pipeline",
    image: "/diagrams/stream-dag.png",
    problemSolved:
      "Gave data engineering teams a self-service platform for building real-time pipelines without writing Flink jobs from scratch — reducing pipeline creation time from weeks to hours.",
    techDecisions: ["Apache Flink", "Kafka Streams", "Kubernetes", "Java"],
  },
];
