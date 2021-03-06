/*
 * Augments the environment-specific CLI API with common functionality.
 */
YUITest.Util.mix(YUITest.CLI, {

    files: [],

    options: {
        verbose: false,
        webcompat: false,
        help: false,
        format: "xunit"
    },
    
    outputHelp: function(){
        this.print([
            "\nUsage: yuitest [options] [file|dir]*",
            " ",
            "Global Options",
            "  --groups groupname  Run only tests cases that are part of groupname.",
            "  --help              Displays this information.",
            "  --format <format>   Specifies output format (junitxml, tap, xunit).",
            "  --verbose           Display informational messages and warnings.",
            "  --webcompat         Load tests designed for use in browsers."   
        ].join("\n") + "\n\n");
    },
    
    processArguments: function(){

        var args    = this.args,  
            arg     = args.shift(), 
            files   = [];  
            
        while(arg){
            if (arg.indexOf("--") == 0){
                this.options[arg.substring(2)] = true;
                
                //get the next argument
                if (arg == "--groups" || arg == "--format"){
                    this.options[arg.substring(2)] = args.shift();
                }
            } else {
                
                //see if it's a directory or a file
                if (this.isDirectory(arg)){
                    files = files.concat(this.getFiles(arg));
                } else {
                    files.push(arg);
                }
            }
            arg = args.shift();
        }

        if (this.options.help || files.length === 0){
            this.outputHelp();
            this.quit(0);
        }

        this.files = files;
        
        //-----------------------------------------------------------------------------
        // Determine output format
        //-----------------------------------------------------------------------------

        switch(this.options.format){
            case "junitxml":
                if (this.options.verbose){
                    this.warn("[INFO] Using JUnitXML output format.\n");
                }
                YUITest.CLI.Format(YUITest.TestFormat.JUnitXML);
                break;
            case "tap":
                if (this.options.verbose){
                    this.warn("[INFO] Using TAP output format.\n");
                }
                YUITest.CLI.Format(YUITest.TestFormat.TAP);
                break;
            default:
                if (this.options.verbose){
                    this.warn("[INFO] Using XUnit output format.\n");
                }
                YUITest.CLI.XUnit();
        }    
    },
    
    start: function(){
    
        this.processArguments();
        this.processFiles();
        
        YUITest.TestRunner.run({
            groups: this.options.groups ? this.options.groups.split(",") : null
        });    
    }        
});

YUITest.CLI.start();
