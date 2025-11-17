import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export const fallbackProblemsByVehicle = {
  "2-wheeler": [
    {
      id: "2w-flat-tire",
      title: "Flat Tire",
      vehicleType: "2-wheeler",
      description: "Tyre deflates from punctures or valve damage, causing unstable handling.",
      solutionId: "2w-flat-tire",
      solution: {
        description: "Stabilise the bike, repair the puncture or replace the tube, and inflate to the specified pressure.",
        steps: [
          "Move the motorcycle to a level surface and support it securely on a stand.",
          "Locate the puncture, remove debris, and insert a plug or patch the inner tube.",
          "Reinstall the wheel if removed and inflate to the PSI listed on the swingarm or manual.",
          "Torque axle hardware to spec and perform a slow test ride to confirm sealing."
        ],
        tools: ["Tire repair kit", "Portable inflator", "Torque wrench"],
        precautions: "Do not ride on a fully flat tire; inspect the sidewall for cuts before inflating.",
        videoLink: "https://youtu.be/JBf7iExWp8Q?si=yPfQt75LY6B0TX1T"
      }
    },
    {
      id: "2w-dead-battery",
      title: "Dead Battery",
      vehicleType: "2-wheeler",
      description: "Starter barely turns or lights dim because the battery cannot supply current.",
      solutionId: "2w-dead-battery",
      solution: {
        description: "Jump-start the motorcycle, verify charging voltage, and replace the battery if it cannot hold a charge.",
        steps: [
          "Connect jumper leads positive to positive and negative to grounded metal, then start the donor source.",
          "Crank the motorcycle briefly and let it idle for at least 20 minutes to replenish charge.",
          "Measure voltage at idle and 5,000 RPM to confirm alternator output between 13.2 and 14.5 volts.",
          "Clean terminals, apply dielectric grease, or replace the battery if readings stay low."
        ],
        tools: ["Jumper cables", "Multimeter", "Dielectric grease"],
        precautions: "Never let clamps touch each other during jump-starting; disconnect in reverse order.",
        videoLink: "https://youtu.be/OiYzmVhgm2s?si=U9nIKrFsMrD-Hh26"
      }
    },
    {
      id: "2w-engine-overheat",
      title: "Engine Overheating",
      vehicleType: "2-wheeler",
      description: "Temperature gauge spikes and coolant boils during slow traffic or spirited riding.",
      solutionId: "2w-engine-overheat",
      solution: {
        description: "Shut the engine down, inspect the cooling system, and restore fluid circulation before riding again.",
        steps: [
          "Stop safely, allow the engine to cool, and avoid opening the radiator cap while hot.",
          "Check coolant level, hoses, and radiator cap seal for leaks or deterioration.",
          "Verify fan operation and flush the coolant if it appears rusty or contaminated.",
          "Reassemble and monitor the gauge during a controlled test ride."
        ],
        tools: ["Coolant funnel", "Radiator pressure tester", "Replacement hoses"],
        precautions: "Use manufacturer-approved coolant mix and replace caps that fail a pressure test.",
        videoLink: "https://youtu.be/Gz8116snAaw?si=4AqHZPg0kjkbh19i"
      }
    },
    {
      id: "2w-chain-slippage",
      title: "Chain Slippage",
      vehicleType: "2-wheeler",
      description: "Chain jumps teeth or chatters due to poor tension or worn sprockets.",
      solutionId: "2w-chain-slippage",
      solution: {
        description: "Adjust slack, clean and lubricate the chain, and replace the drive set if wear is excessive.",
        steps: [
          "Measure chain slack midway between sprockets and adjust to the specification in the manual.",
          "Clean the chain with kerosene, dry it thoroughly, and apply chain lube on the warm chain.",
          "Inspect sprocket teeth for hooking or shark-fin shapes and replace the set if present.",
          "Recheck alignment marks and spin the wheel to confirm smooth rotation."
        ],
        tools: ["Chain alignment tool", "Kerosene", "Chain lubricant"],
        precautions: "Always rotate the wheel forward while checking slack to simulate riding load.",
        videoLink: "https://youtu.be/VBRffCgdUNM?si=gDuev_b9x5WEWq3h"
      }
    },
    {
      id: "2w-fuel-delivery",
      title: "Fuel Delivery Issue",
      vehicleType: "2-wheeler",
      description: "Engine sputters or stalls because fuel filter or pump cannot supply flow.",
      solutionId: "2w-fuel-delivery",
      solution: {
        description: "Inspect filters and pump pressure, clean the fuel system, and ensure fresh fuel reaches the injectors or carbs.",
        steps: [
          "Drain stale fuel and refill with high-octane gasoline recommended by the manufacturer.",
          "Replace in-line or in-tank fuel filters and inspect the pump screen for debris.",
          "Attach a pressure gauge to confirm output meets factory specifications.",
          "Add injector or carb cleaner to remove varnish from delivery components."
        ],
        tools: ["Fuel pressure gauge", "Replacement filters", "Fuel system cleaner"],
        precautions: "Work in a well-ventilated area and avoid sparks around open fuel containers.",
        videoLink: "https://youtu.be/nzwx8H_7jnA?si=3CmdY1Z1DSThvY2L"
      }
    },
    {
      id: "2w-electrical-short",
      title: "Electrical Short",
      vehicleType: "2-wheeler",
      description: "Lights flicker or fuses blow because of corroded connectors or chafed wiring.",
      solutionId: "2w-electrical-short",
      solution: {
        description: "Isolate the failing circuit, repair damaged wiring, and protect connections from moisture.",
        steps: [
          "Check fuse status and identify which circuit repeatedly fails.",
          "Inspect wiring harness sections near the steering head and under the seat for chafing.",
          "Repair breaks with solder and heat-shrink tubing and clean terminals with contact cleaner.",
          "Apply dielectric grease and secure the harness to prevent further rubbing."
        ],
        tools: ["Multimeter", "Soldering iron", "Heat-shrink tubing"],
        precautions: "Disconnect the battery negative terminal before repairing any wiring.",
        videoLink: "https://youtu.be/OJUrEnZNeJg?si=Yfg_9q6P2IatLNgc"
      }
    },
    {
      id: "2w-brake-fade",
      title: "Brake Fade",
      vehicleType: "2-wheeler",
      description: "Lever feels soft and stopping distance grows because pads or fluid have degraded.",
      solutionId: "2w-brake-fade",
      solution: {
        description: "Service the braking system by replacing fluid, pads, and ensuring calipers move freely.",
        steps: [
          "Inspect pad thickness and rotor glazing; replace components below service limits.",
          "Bleed the brakes with the manufacturer-specified DOT fluid to remove air and moisture.",
          "Clean and lubricate caliper slide pins so pads retract evenly.",
          "Pump the lever to seat pads against the rotor before riding."
        ],
        tools: ["Brake bleeder kit", "Torque wrench", "Brake cleaner"],
        precautions: "Do not spill brake fluid on paint; cover bodywork before bleeding.",
        videoLink: "https://youtu.be/6DoX5Ve1Oiw?si=M7IOj90QFUaoZnAu"
      }
    },
    {
      id: "2w-clutch-drag",
      title: "Clutch Drag",
      vehicleType: "2-wheeler",
      description: "Gear shifts feel stiff or the bike creeps with the lever fully pulled in.",
      solutionId: "2w-clutch-drag",
      solution: {
        description: "Adjust free play, bleed hydraulic circuits, and renew worn friction components to restore smooth engagement.",
        steps: [
          "Set cable or master-cylinder free play to the guideline in the service manual.",
          "Bleed the clutch hydraulic system to remove air bubbles that hold pressure.",
          "Inspect plates and steels for warping or glazing and replace as a matched set if damaged.",
          "Reassemble with fresh oil of the recommended viscosity."
        ],
        tools: ["Clutch alignment tool", "Feeler gauges", "Torque wrench"],
        precautions: "Soak new friction plates in engine oil for several hours before installation.",
        videoLink: "https://youtu.be/2owO_GhYjzE?si=3uuy0gtSL9L0n6wt"
      }
    },
    {
      id: "2w-exhaust-leak",
      title: "Exhaust Leak",
      vehicleType: "2-wheeler",
      description: "Exhaust note becomes raspy and backfires due to gaps in joints or cracked pipes.",
      solutionId: "2w-exhaust-leak",
      solution: {
        description: "Locate escaping gases, replace gaskets, and tighten joints to restore correct backpressure.",
        steps: [
          "Start the engine cold and feel for pulses around headers, mid-pipes, and muffler clamps.",
          "Remove components carefully and replace crushed or burnt exhaust gaskets.",
          "Weld or replace cracked sections and reinstall using high-temperature sealant where specified.",
          "Torque fasteners evenly and recheck for leaks after a heat cycle."
        ],
        tools: ["Socket set", "Exhaust gaskets", "High-temp sealant"],
        precautions: "Wear gloves when checking for leaks; surfaces heat quickly even at idle.",
        videoLink: "https://youtu.be/iFrUiwQO7_4?si=w0wacFz_yq5g5G2U"
      }
    },
    {
      id: "2w-suspension-sag",
      title: "Suspension Sag",
      vehicleType: "2-wheeler",
      description: "Bike feels sloppy or bottoms out because preload and damping are out of balance.",
      solutionId: "2w-suspension-sag",
      solution: {
        description: "Measure sag, adjust preload and damping, and refresh worn fork seals or shock components.",
        steps: [
          "Measure static and rider sag front and rear and compare to target values.",
          "Adjust preload collars or fork caps to bring sag into the recommended range.",
          "Dial in rebound and compression damping to control oscillations.",
          "Replace leaking fork seals or rebuild the shock if damping remains inconsistent."
        ],
        tools: ["Measuring tape", "Spanner wrench", "Fork seal driver"],
        precautions: "Record baseline settings before altering suspension so you can revert if needed.",
        videoLink: "https://youtu.be/TFqhpvzdI8Q?si=KluvmcgZWu1tnu5m"
      }
    },
    {
      id: "2w-ignition-failure",
      title: "Ignition Failure",
      vehicleType: "2-wheeler",
      description: "Engine cranks but will not fire because the ignition circuit fails to produce spark.",
      solutionId: "2w-ignition-failure",
      solution: {
        description: "Trace the ignition path, test components, and correct wiring or switch faults to restore spark.",
        steps: [
          "Verify the kill switch and side-stand switch are functioning and not cutting spark.",
          "Use a multimeter to test ignition switch continuity and coil primary resistance.",
          "Inspect spark plugs and leads, replacing any that show carbon tracking or cracks.",
          "Repair or replace the ignition switch or CDI if diagnostic values fall outside spec."
        ],
        tools: ["Multimeter", "Spark tester", "Replacement ignition switch"],
        precautions: "Never crank the engine with coils disconnected; it can damage electronic modules.",
        videoLink: "https://www.youtube.com/watch?v=BALdGha_4So"
      }
    },
    {
      id: "2w-oil-leak",
      title: "Oil Leak",
      vehicleType: "2-wheeler",
      description: "Oil drips onto the floor or engine cases due to failing seals or gaskets.",
      solutionId: "2w-oil-leak",
      solution: {
        description: "Clean the engine, pinpoint the leak, and replace the faulty gasket or seal with proper torque.",
        steps: [
          "Degrease the engine and run it briefly to identify the first point of oil emergence.",
          "Use UV dye if necessary to trace hidden leaks around seals and gaskets.",
          "Replace the faulty component, applying manufacturer-specified sealant if required.",
          "Torque bolts in a criss-cross pattern and monitor for seepage after a test ride."
        ],
        tools: ["Degreaser", "UV leak-detection kit", "Torque wrench"],
        precautions: "Dispose of oil-soaked rags responsibly and avoid overtightening aluminum covers.",
        videoLink: "https://www.youtube.com/watch?v=J6Pb0EpN5Hg"
      }
    },
    {
      id: "2w-throttle-hesitation",
      title: "Throttle Hesitation",
      vehicleType: "2-wheeler",
      description: "Engine stumbles or lurches during acceleration due to air-fuel imbalance.",
      solutionId: "2w-throttle-hesitation",
      solution: {
        description: "Balance throttle bodies or carburetors, clean idle circuits, and set cables to eliminate slack.",
        steps: [
          "Inspect throttle cables for fraying and adjust free play to the manual specification.",
          "Synchronise carburetors or throttle bodies using a vacuum gauge set.",
          "Clean pilot jets and injectors with appropriate cleaner to remove varnish.",
          "Reset ECU trims or idle speed according to the service guide."
        ],
        tools: ["Vacuum gauge", "Carb cleaner", "Throttle cable lubricator"],
        precautions: "Perform synchronization with the engine at operating temperature to obtain accurate readings.",
        videoLink: "https://www.youtube.com/watch?v=FQJSS3RhDqw"
      }
    },
    {
      id: "2w-starter-failure",
      title: "Starter Motor Failure",
      vehicleType: "2-wheeler",
      description: "Starter clicks or spins slowly because brushes or solenoid contacts are worn.",
      solutionId: "2w-starter-failure",
      solution: {
        description: "Test system voltage, inspect the solenoid, and rebuild or replace the starter motor.",
        steps: [
          "Check battery voltage drop while cranking to ensure it stays above 10 volts.",
          "Test starter relay continuity and listen for engagement when the button is pressed.",
          "Remove the starter, inspect brushes and commutator, and clean or replace worn components.",
          "Bench-test the unit before reinstalling and retest starting performance."
        ],
        tools: ["Multimeter", "Starter brush kit", "Socket set"],
        precautions: "Disconnect the battery before removing the starter to prevent accidental shorts.",
        videoLink: "https://www.youtube.com/watch?v=hlClh8n1e-4"
      }
    },
    {
      id: "2w-air-filter-clog",
      title: "Clogged Air Filter",
      vehicleType: "2-wheeler",
      description: "Engine feels suffocated and fuel economy drops due to restricted airflow.",
      solutionId: "2w-air-filter-clog",
      solution: {
        description: "Remove, clean, and re-oil the air filter or replace it to restore unrestricted intake flow.",
        steps: [
          "Remove the seat or side cover to access the airbox and carefully extract the filter element.",
          "Clean foam filters with approved solvent or use a dedicated kit for cotton gauze elements.",
          "Allow the filter to dry completely, then apply filter oil evenly without oversaturating.",
          "Reinstall the element, ensuring the seal seats properly to prevent unfiltered air entry."
        ],
        tools: ["Air filter cleaner", "Filter oil", "Shop towels"],
        precautions: "Do not ride without the filter installed; debris ingestion can severely damage the engine.",
        videoLink: "https://www.youtube.com/watch?v=J4SELf6U4U0"
      }
    }
  ]
};

export const fallbackProblemIndex = Object.values(fallbackProblemsByVehicle).flat().reduce((acc, problem) => {
  acc[problem.id] = problem;
  return acc;
}, {});

export default function ViewProblems() {
  const { vehicleType } = useParams();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const q = query(
          collection(db, "problems"),
          where("vehicleType", "==", vehicleType)
        );
        const querySnapshot = await getDocs(q);
        const problemsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        if (problemsList.length > 0) {
          setProblems(problemsList);
        } else if (fallbackProblemsByVehicle[vehicleType]) {
          setProblems(fallbackProblemsByVehicle[vehicleType]);
        } else {
          setProblems([]);
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
        if (fallbackProblemsByVehicle[vehicleType]) {
          setProblems(fallbackProblemsByVehicle[vehicleType]);
        } else {
          setProblems([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [vehicleType]);

  const vehicleNames = {
    "2-wheeler": "2-Wheeler",
    "3-wheeler": "3-Wheeler",
    "4-wheeler": "4-Wheeler"
  };

  if (loading) return <div className="dashboard-container"><p>Loading problems...</p></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Problems for {vehicleNames[vehicleType] || vehicleType}</h1>
        <p>Select a problem to see the solution and video tutorial</p>
      </div>

      {problems.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <p>No problems found for this vehicle type. Please check back later!</p>
        </div>
      ) : (
        <div className="problems-list">
          {problems.map(problem => (
            <Link
              key={problem.id}
              to={`/solution/${problem.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="problem-card">
                <h3>{problem.title}</h3>
                <p>{problem.description}</p>
                <div style={{ color: "#2563eb", fontWeight: "600" }}>
                  View Solution →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
