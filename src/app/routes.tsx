import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { AptitudeRound } from "./components/AptitudeRound";
import { CodingRound } from "./components/CodingRound";
import { TechnicalRound } from "./components/TechnicalRound";
import { HRRound } from "./components/HRRound";
import { Results } from "./components/Results";
import { ResumeAnalyzer } from "./components/ResumeAnalyzer";
import { CompanyPreparation } from "./components/CompanyPreparation";
import { Premium } from "./components/Premium";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "aptitude", Component: AptitudeRound },
      { path: "coding", Component: CodingRound },
      { path: "technical", Component: TechnicalRound },
      { path: "hr-interview", Component: HRRound },
      { path: "results", Component: Results },
      { path: "resume", Component: ResumeAnalyzer },
      { path: "companies", Component: CompanyPreparation },
      { path: "premium", Component: Premium },
    ],
  },
]);
