# Finance Pages deployment recovery — November 9, 2026

DuPont release commit71e9159 pushed successfully, but GitHub's built-in Pages workflow failed before build/deploy jobs were created. Run42671721241 annotation: Internal server error, correlation4f1b2d8e-5956-4ed1-be52-83592747fc30. A fresh Pages build request was accepted, but run42672596491 also failed internally, correlationdc5d5424-8c27-4a08-a582-1e9bdea4576f; only report-build-status ran successfully. GitHub refused failed-job retries for both dynamic runs. The new DuPont URL returned404. Operations429a0ab deployed successfully.

Recovery uses an explicit official static Pages workflow on ubuntu-24.04: checkout, configure Pages, upload the committed docs directory, deploy. No runtime compilation; no changes to generated site content. Contents read is global; Pages write and OIDC are scoped to the publishing job. Same github-pages environment and site URL. Trigger only main pushes affecting docs/workflow, plus manual dispatch. No cancellation of an active deployment. This replaces the failing branch-based publisher.

Live deployment verification is recorded after the recovery run completes.
