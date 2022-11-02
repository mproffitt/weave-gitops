import { render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { Kind } from "../../lib/api/core/types.pb";
import {
  createCoreMockClient,
  withContext,
  withTheme,
} from "../../lib/test-utils";
import Sources from "../v2/Sources";
describe("Sources", () => {
  const getVersionMock = () => {
    return {
      semver: "",
      commit: "",
      branch: "",
      buildTime: "",
      fluxVersion: "",
      kubeVersion: "",
    };
  };
  const responses = [
    {
      payload:
        '{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","kind":"Bucket","metadata":{"annotations":{"kubectl.kubernetes.io/last-applied-configuration":"{\\"apiVersion\\":\\"source.toolkit.fluxcd.io/v1beta2\\",\\"kind\\":\\"Bucket\\",\\"metadata\\":{\\"annotations\\":{},\\"name\\":\\"minio-bucket\\",\\"namespace\\":\\"bucket\\"},\\"spec\\":{\\"bucketName\\":\\"example\\",\\"endpoint\\":\\"minio.minio.svc.cluster.local:9000\\",\\"insecure\\":true,\\"interval\\":\\"5m0s\\",\\"secretRef\\":{\\"name\\":\\"minio-bucket-secret\\"}}}\\n","reconcile.fluxcd.io/requestedAt":"2022-07-15T11:46:15.484144053Z"},"creationTimestamp":"2022-07-15T11:45:45Z","finalizers":["finalizers.fluxcd.io"],"generation":2,"managedFields":[{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:annotations":{".":{},"f:kubectl.kubernetes.io/last-applied-configuration":{}}},"f:spec":{".":{},"f:bucketName":{},"f:endpoint":{},"f:insecure":{},"f:interval":{},"f:provider":{},"f:secretRef":{".":{},"f:name":{}},"f:timeout":{}}},"manager":"kubectl-client-side-apply","operation":"Update","time":"2022-07-15T11:45:45Z"},{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:finalizers":{".":{},"v:\\"finalizers.fluxcd.io\\"":{}}},"f:status":{"f:artifact":{".":{},"f:checksum":{},"f:lastUpdateTime":{},"f:path":{},"f:revision":{},"f:size":{},"f:url":{}},"f:conditions":{},"f:lastHandledReconcileAt":{},"f:observedGeneration":{},"f:url":{}}},"manager":"source-controller","operation":"Update","time":"2022-07-15T11:46:15Z"},{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:annotations":{"f:reconcile.fluxcd.io/requestedAt":{}}},"f:spec":{"f:suspend":{}}},"manager":"gitops-server","operation":"Update","time":"2022-07-15T11:53:33Z"}],"name":"minio-bucket","namespace":"bucket","resourceVersion":"253347","uid":"917cb4b8-4c2a-40bd-8421-95675219e6cc"},"spec":{"bucketName":"example","endpoint":"minio.minio.svc.cluster.local:9000","insecure":true,"interval":"5m0s","provider":"generic","secretRef":{"name":"minio-bucket-secret"},"suspend":true,"timeout":"60s"},"status":{"artifact":{"checksum":"72aa638abb455ca5f9ef4825b949fd2de4d4be0a74895bf7ed2338622cd12686","lastUpdateTime":"2022-07-15T11:46:15Z","path":"bucket/bucket/minio-bucket/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.tar.gz","revision":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","size":74,"url":"http://source-controller.flux-system.svc.cluster.local./bucket/bucket/minio-bucket/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.tar.gz"},"conditions":[{"lastTransitionTime":"2022-07-15T11:46:15Z","message":"stored artifact for revision \'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\'","observedGeneration":1,"reason":"Succeeded","status":"True","type":"Ready"},{"lastTransitionTime":"2022-07-15T11:46:15Z","message":"stored artifact for revision \'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\'","observedGeneration":1,"reason":"Succeeded","status":"True","type":"ArtifactInStorage"}],"lastHandledReconcileAt":"2022-07-15T11:46:15.484144053Z","observedGeneration":1,"url":"http://source-controller.flux-system.svc.cluster.local./bucket/bucket/minio-bucket/latest.tar.gz"}}\n',
      clusterName: "Default",
    },
    {
      payload:
        '{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","kind":"GitRepository","metadata":{"annotations":{"kubectl.kubernetes.io/last-applied-configuration":"{\\"apiVersion\\":\\"source.toolkit.fluxcd.io/v1beta2\\",\\"kind\\":\\"GitRepository\\",\\"metadata\\":{\\"annotations\\":{\\"metadata.weave.works/description\\":\\"This is my Weave GitOps application\\",\\"metadata.weave.works/metrics-dashboard\\":\\"https://www.google.com/\\",\\"metadata.weave.works/multi-line\\":\\"I can put my metadata\\\\nAcross multiple lines\\\\n\\"},\\"name\\":\\"gitrepository\\",\\"namespace\\":\\"metadata\\"},\\"spec\\":{\\"interval\\":\\"1h1s\\",\\"ref\\":{\\"branch\\":\\"main\\"},\\"url\\":\\"https://github.com/ozamosi/flux-cases.git\\"}}\\n","metadata.weave.works/description":"This is my Weave GitOps application","metadata.weave.works/metrics-dashboard":"https://www.google.com/","metadata.weave.works/multi-line":"I can put my metadata\\nAcross multiple lines\\n"},"creationTimestamp":"2022-07-14T17:57:56Z","finalizers":["finalizers.fluxcd.io"],"generation":1,"managedFields":[{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:annotations":{".":{},"f:kubectl.kubernetes.io/last-applied-configuration":{},"f:metadata.weave.works/description":{},"f:metadata.weave.works/metrics-dashboard":{},"f:metadata.weave.works/multi-line":{}}},"f:spec":{".":{},"f:gitImplementation":{},"f:interval":{},"f:ref":{".":{},"f:branch":{}},"f:timeout":{},"f:url":{}}},"manager":"kubectl-client-side-apply","operation":"Update","time":"2022-07-14T17:57:56Z"},{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:finalizers":{".":{},"v:\\"finalizers.fluxcd.io\\"":{}}},"f:status":{"f:artifact":{".":{},"f:checksum":{},"f:lastUpdateTime":{},"f:path":{},"f:revision":{},"f:size":{},"f:url":{}},"f:conditions":{},"f:contentConfigChecksum":{},"f:observedGeneration":{},"f:url":{}}},"manager":"source-controller","operation":"Update","time":"2022-07-14T17:58:12Z"}],"name":"gitrepository","namespace":"metadata","resourceVersion":"35392","uid":"da3dbe82-d564-4aea-a84e-c443f7596c87"},"spec":{"gitImplementation":"go-git","interval":"1h1s","ref":{"branch":"main"},"timeout":"60s","url":"https://github.com/ozamosi/flux-cases.git"},"status":{"artifact":{"checksum":"3a4311e0e3112f882c9b476cf4835f07d9b78ec97b6b53cbd63ce99d790ff07c","lastUpdateTime":"2022-07-14T18:03:33Z","path":"gitrepository/metadata/gitrepository/1ab71eff7d482a6c5e4ee20b8032a1b4f3bbd23d.tar.gz","revision":"main/1ab71eff7d482a6c5e4ee20b8032a1b4f3bbd23d","size":1111,"url":"http://source-controller.flux-system.svc.cluster.local./gitrepository/metadata/gitrepository/1ab71eff7d482a6c5e4ee20b8032a1b4f3bbd23d.tar.gz"},"conditions":[{"lastTransitionTime":"2022-07-14T17:58:12Z","message":"stored artifact for revision \'main/1ab71eff7d482a6c5e4ee20b8032a1b4f3bbd23d\'","observedGeneration":1,"reason":"Succeeded","status":"True","type":"Ready"},{"lastTransitionTime":"2022-07-14T17:57:57Z","message":"stored artifact for revision \'main/1ab71eff7d482a6c5e4ee20b8032a1b4f3bbd23d\'","observedGeneration":1,"reason":"Succeeded","status":"True","type":"ArtifactInStorage"}],"contentConfigChecksum":"sha256:fcbcf165908dd18a9e49f7ff27810176db8e9f63b4352213741664245224f8aa","observedGeneration":1,"url":"http://source-controller.flux-system.svc.cluster.local./gitrepository/metadata/gitrepository/latest.tar.gz"}}\n',
      clusterName: "Default",
    },
    {
      payload:
        '{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","kind":"HelmChart","metadata":{"creationTimestamp":"2022-07-14T17:57:56Z","finalizers":["finalizers.fluxcd.io"],"generation":1,"managedFields":[{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","fieldsType":"FieldsV1","fieldsV1":{"f:spec":{".":{},"f:chart":{},"f:interval":{},"f:reconcileStrategy":{},"f:sourceRef":{".":{},"f:kind":{},"f:name":{}},"f:version":{}}},"manager":"helm-controller","operation":"Update","time":"2022-07-14T17:57:56Z"},{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:finalizers":{".":{},"v:\\"finalizers.fluxcd.io\\"":{}}},"f:status":{"f:artifact":{".":{},"f:checksum":{},"f:lastUpdateTime":{},"f:path":{},"f:revision":{},"f:size":{},"f:url":{}},"f:conditions":{},"f:observedChartName":{},"f:observedGeneration":{},"f:observedSourceArtifactRevision":{},"f:url":{}}},"manager":"source-controller","operation":"Update","time":"2022-07-14T18:03:33Z"}],"name":"metadata-helmrelease","namespace":"metadata","resourceVersion":"35401","uid":"3e3bd715-ac42-4b95-80f8-0364a4091cdc"},"spec":{"chart":"weave-gitops","interval":"1h0m0s","reconcileStrategy":"ChartVersion","sourceRef":{"kind":"HelmRepository","name":"helmrepository"},"version":"*"},"status":{"artifact":{"checksum":"2b32ac51161e98a1eeba69566832c83f7f601d82e7f7f60d6fe87c1372bd2390","lastUpdateTime":"2022-07-14T18:03:33Z","path":"helmchart/metadata/metadata-helmrelease/weave-gitops-2.2.0.tgz","revision":"2.2.0","size":8051,"url":"http://source-controller.flux-system.svc.cluster.local./helmchart/metadata/metadata-helmrelease/weave-gitops-2.2.0.tgz"},"conditions":[{"lastTransitionTime":"2022-07-14T18:03:33Z","message":"pulled \'weave-gitops\' chart with version \'2.2.0\'","observedGeneration":1,"reason":"ChartPullSucceeded","status":"True","type":"Ready"},{"lastTransitionTime":"2022-07-14T18:03:33Z","message":"pulled \'weave-gitops\' chart with version \'2.2.0\'","observedGeneration":1,"reason":"ChartPullSucceeded","status":"True","type":"ArtifactInStorage"}],"observedChartName":"weave-gitops","observedGeneration":1,"observedSourceArtifactRevision":"194ca040b33f7a2d54b77c1bc5c8265eece32c9e065d8a9ea3fb816797e9b5b5","url":"http://source-controller.flux-system.svc.cluster.local./helmchart/metadata/metadata-helmrelease/latest.tar.gz"}}\n',
      clusterName: "Default",
    },
    {
      payload:
        '{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","kind":"HelmRepository","metadata":{"annotations":{"kubectl.kubernetes.io/last-applied-configuration":"{\\"apiVersion\\":\\"source.toolkit.fluxcd.io/v1beta2\\",\\"kind\\":\\"HelmRepository\\",\\"metadata\\":{\\"annotations\\":{},\\"name\\":\\"the name\\",\\"namespace\\":\\"some namespace\\"},\\"spec\\":{\\"interval\\":\\"1h2m3s\\",\\"url\\":\\"https://helm.gitops.weave.works\\"}}\\n"},"creationTimestamp":"2022-07-14T17:57:56Z","finalizers":["finalizers.fluxcd.io"],"generation":1,"managedFields":[{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:annotations":{".":{},"f:kubectl.kubernetes.io/last-applied-configuration":{}}},"f:spec":{".":{},"f:interval":{},"f:timeout":{},"f:url":{}}},"manager":"kubectl-client-side-apply","operation":"Update","time":"2022-07-14T17:57:56Z"},{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:finalizers":{".":{},"v:\\"finalizers.fluxcd.io\\"":{}}},"f:status":{"f:artifact":{".":{},"f:checksum":{},"f:lastUpdateTime":{},"f:path":{},"f:revision":{},"f:size":{},"f:url":{}},"f:conditions":{},"f:observedGeneration":{},"f:url":{}}},"manager":"source-controller","operation":"Update","time":"2022-07-14T17:58:12Z"}],"name":"the name","namespace":"some namespace","resourceVersion":"35391","uid":"f2804b1f-9fec-45e6-acb1-4ea135859290"},"spec":{"interval":"1h2m3s","timeout":"60s","url":"https://helm.gitops.weave.works"},"status":{"artifact":{"checksum":"194ca040b33f7a2d54b77c1bc5c8265eece32c9e065d8a9ea3fb816797e9b5b5","lastUpdateTime":"2022-07-14T18:03:32Z","path":"helmrepository/metadata/helmrepository/index-194ca040b33f7a2d54b77c1bc5c8265eece32c9e065d8a9ea3fb816797e9b5b5.yaml","revision":"194ca040b33f7a2d54b77c1bc5c8265eece32c9e065d8a9ea3fb816797e9b5b5","size":6524,"url":"http://source-controller.flux-system.svc.cluster.local./helmrepository/metadata/helmrepository/index-194ca040b33f7a2d54b77c1bc5c8265eece32c9e065d8a9ea3fb816797e9b5b5.yaml"},"conditions":[{"lastTransitionTime":"2022-07-14T17:58:12Z","message":"stored artifact for revision \'194ca040b33f7a2d54b77c1bc5c8265eece32c9e065d8a9ea3fb816797e9b5b5\'","observedGeneration":1,"reason":"Succeeded","status":"True","type":"Ready"},{"lastTransitionTime":"2022-07-14T17:57:57Z","message":"stored artifact for revision \'194ca040b33f7a2d54b77c1bc5c8265eece32c9e065d8a9ea3fb816797e9b5b5\'","observedGeneration":1,"reason":"Succeeded","status":"True","type":"ArtifactInStorage"}],"observedGeneration":1,"url":"http://source-controller.flux-system.svc.cluster.local./helmrepository/metadata/helmrepository/index.yaml"}}\n',
      clusterName: "Default",
    },
    {
      payload:
        '{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","kind":"OCIRepository","metadata":{"creationTimestamp":"2022-08-09T08:55:13Z","finalizers":["finalizers.fluxcd.io"],"generation":1,"managedFields":[{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","fieldsType":"FieldsV1","fieldsV1":{"f:spec":{".":{},"f:interval":{},"f:provider":{},"f:ref":{".":{},"f:semver":{}},"f:timeout":{},"f:url":{}}},"manager":"flux","operation":"Update","time":"2022-08-09T08:55:13Z"},{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:finalizers":{".":{},"v:\\"finalizers.fluxcd.io\\"":{}}}},"manager":"source-controller","operation":"Update","time":"2022-08-09T08:55:13Z"},{"apiVersion":"source.toolkit.fluxcd.io/v1beta2","fieldsType":"FieldsV1","fieldsV1":{"f:status":{"f:artifact":{".":{},"f:checksum":{},"f:lastUpdateTime":{},"f:metadata":{".":{},"f:org.opencontainers.image.created":{},"f:org.opencontainers.image.revision":{},"f:org.opencontainers.image.source":{}},"f:path":{},"f:revision":{},"f:size":{},"f:url":{}},"f:conditions":{},"f:observedGeneration":{},"f:url":{}}},"manager":"source-controller","operation":"Update","subresource":"status","time":"2022-08-09T08:55:15Z"}],"name":"podinfo-oci","namespace":"flux-system","resourceVersion":"177657","uid":"179d98f9-10e9-45f3-bd96-295b54522c91"},"spec":{"interval":"10m0s","provider":"generic","ref":{"semver":"6.x"},"timeout":"60s","url":"oci://ghcr.io/stefanprodan/manifests/podinfo"},"status":{"artifact":{"checksum":"9f3bc0f341d4ecf2bab460cc59320a2a9ea292f01d7b96e32740a9abfd341088","lastUpdateTime":"2022-08-09T08:55:15Z","metadata":{"org.opencontainers.image.created":"2022-08-08T12:31:41+03:00","org.opencontainers.image.revision":"6.1.8/b3b00fe35424a45d373bf4c7214178bc36fd7872","org.opencontainers.image.source":"https://github.com/stefanprodan/podinfo.git"},"path":"ocirepository/flux-system/podinfo-oci/84dd766945aa73a62682f2411274dc738eb7547f8d6ae55e8bf84820f20c006d.tar.gz","revision":"84dd766945aa73a62682f2411274dc738eb7547f8d6ae55e8bf84820f20c006d","size":1105,"url":"http://source-controller.flux-system.svc.cluster.local./ocirepository/flux-system/podinfo-oci/84dd766945aa73a62682f2411274dc738eb7547f8d6ae55e8bf84820f20c006d.tar.gz"},"conditions":[{"lastTransitionTime":"2022-08-09T08:55:15Z","message":"stored artifact for digest \'84dd766945aa73a62682f2411274dc738eb7547f8d6ae55e8bf84820f20c006d\'","observedGeneration":1,"reason":"Succeeded","status":"True","type":"Ready"},{"lastTransitionTime":"2022-08-09T08:55:15Z","message":"stored artifact for digest \'84dd766945aa73a62682f2411274dc738eb7547f8d6ae55e8bf84820f20c006d\'","observedGeneration":1,"reason":"Succeeded","status":"True","type":"ArtifactInStorage"}],"observedGeneration":1,"url":"http://source-controller.flux-system.svc.cluster.local./ocirepository/flux-system/podinfo-oci/latest.tar.gz"}}\n',
      clusterName: "Default",
    },
  ];

  it("should list sources", async () => {
    const client = createCoreMockClient({
      ListObjects: ({ kind }) => {
        const fullResponse = { objects: [], errors: [] };
        if (kind === Kind.Bucket) fullResponse.objects = [responses[0]];
        if (kind === Kind.GitRepository) fullResponse.objects = [responses[1]];
        if (kind === Kind.HelmChart) fullResponse.objects = [responses[2]];
        if (kind === Kind.HelmRepository) fullResponse.objects = [responses[3]];
        if (kind === Kind.OCIRepository) fullResponse.objects = [responses[4]];
        return fullResponse;
      },
      GetVersion: getVersionMock,
    });
    render(withTheme(withContext(<Sources />, "/sources", { api: client })));
    await waitFor(() => {
      expect(screen.getAllByText(Kind.Bucket).length).toBeTruthy();
      expect(screen.getAllByText(Kind.GitRepository).length).toBeTruthy();
      expect(screen.getAllByText(Kind.HelmChart).length).toBeTruthy();
      expect(screen.getAllByText(Kind.HelmRepository).length).toBeTruthy();
      expect(screen.getAllByText(Kind.OCIRepository).length).toBeTruthy();
    });
  });
  it("should handle undefined response", async () => {
    const client2 = createCoreMockClient({
      ListObjects: () => {
        return { objects: undefined, errors: undefined };
      },
      GetVersion: getVersionMock,
    });
    render(withTheme(withContext(<Sources />, "/sources", { api: client2 })));
    await waitFor(() => expect(screen.getByText("No data")).toBeTruthy());
  });
});
