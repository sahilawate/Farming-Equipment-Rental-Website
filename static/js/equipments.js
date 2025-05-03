document.addEventListener("DOMContentLoaded", function () {
    const equipmentBoxes = document.querySelectorAll(".box");

    // Correct paths based on Flask routes
    const equipmentLinks = {
        "ripper": "/info/ripper",
        "drone": "/info/drone",
        "fertilizer spreader": "/info/fertilizer-spreader",
        "boom sprayer": "/info/boom-sprayer",
        "box blade": "/info/box-blade",
        "rotary cutter": "/info/rotary-cutter",
        "leveler": "/info/leveler",
        "landscape rake": "/info/landscape-rake",
        "square baler": "/info/square-baler",
        "hay rake": "/info/hay-rake",
        "rotary mulcher": "/info/rotary-mulcher",
        "combine harvester": "/info/combine-harvester",
        "sugar cane loader": "/info/sugar-cane-loader",
        "multi crop harvester": "/info/multi-crop-harvester",
        "pneumatic planter": "/info/pneumatic-planter",
        "post hole digger": "/info/post-hole-digger",
        "zero till": "/info/zero-till",
        "seeder": "/info/seeder",
        "mini power tiller": "/info/mini-power-tiller",
        "farm tractor": "/info/farm-tractor",
        "paddy field tractor": "/info/paddy-field-tractor",
        "row crop tractor": "/info/row-crop-tractor",
        "utility tractor": "/info/utility-tractor",
        "heavy tractor": "/info/heavy-tractor",
        "regular tractor": "/info/regular-tractor",
        "driller": "/info/driller",
        "plow": "/info/plow",
        "sub soiler": "/info/sub-soiler",
        "hydraulic harrow": "/info/hydraulic-harrow"
    };

    equipmentBoxes.forEach((box) => {
        const moreInfoButton = box.querySelector(".More_Info");
        const rentNowButton = box.querySelector(".rent-btn");

        // "More Info" button event
        if (moreInfoButton) {
            moreInfoButton.addEventListener("click", function () {
                moreInfoButton.style.transform = "scale(1.1) rotate(5deg)";
                moreInfoButton.style.transition = "transform 0.3s ease-in-out";
                
                setTimeout(() => {
                    moreInfoButton.style.transform = "scale(1) rotate(0deg)";
                }, 300);

                // Get equipment name
                let equipmentName = box.querySelector("h3").innerText.toLowerCase().trim();

                if (equipmentLinks.hasOwnProperty(equipmentName)) {
                    console.log(`Redirecting to: ${equipmentLinks[equipmentName]}`);
                    window.location.href = equipmentLinks[equipmentName];
                } else {
                    console.error(`Info page not found for: ${equipmentName}`);
                    alert("Information page not found for " + equipmentName);
                }
            });
        }

        // "Rent Now" button event
        if (rentNowButton) {
            rentNowButton.addEventListener("click", function () {
                rentNowButton.style.transform = "scale(1.1) rotate(5deg)";
                rentNowButton.style.transition = "transform 0.3s ease-in-out";

                setTimeout(() => {
                    rentNowButton.style.transform = "scale(1) rotate(0deg)";
                }, 300);

                console.log("Redirecting to rental form...");
                window.location.href = "/rental-form";  // Flask route for the rental form
            });
        }
    });
});
