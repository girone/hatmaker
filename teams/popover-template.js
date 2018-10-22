var popoverTemplate = `
    <div class="popover shadow-lg rounded" role="tooltip">
        <div class="arrow"></div>
        <h3 class="popover-header"></h3>
        <div class="popover-body">
        </div>
        <div class="container" style="margin-bottom: 10px;">
            <div class="row align-center">
                <div class="col-4 offset-8">
                    <button type="button" class="btn btn-primary btn-sm btn-block" onclick="tutorialNextStep()">Next</button>
                </div>
            </div>
        </div>
    </div>`;