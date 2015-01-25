'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var path = require('path');
var npmName = require('npm-name');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the awesome ' + chalk.green('Assemble') + chalk.cyan('Skeletor')  + ' generator!'
        ));

        var prompts = [{
            type: 'confirm',
            name: 'installOption',
            message: 'Would you like to run ' + chalk.yellow('npm & bower install') + '?',
            default: true
        }];

        this.prompt(prompts, function (props) {
            this.options['skip-install']  = props.installOption;
            done();
        }.bind(this));

    },

    askForGeneratorName: function () {
        var done = this.async();

        var prompts = [{
            name: 'projectName',
            message: 'What\'s the base name of your project?',
            default: 'Project Name'
        }];

        this.prompt(prompts, function (props) {
            this.appname = props.projectName;
            this.destinationRoot(this.appname);
            this.config.save();
            done();
        }.bind(this));
    },

    writing: {
        app: function () {
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json'),
                { "name": this.appname }
            );
            this.fs.copyTpl(
                this.templatePath('_bower.json'),
                this.destinationPath('bower.json'),
                { "name": this.appname }
            );
            this.fs.copy(
                this.templatePath('Gruntfile.js'),
                this.destinationPath('Gruntfile.js')
            );
        },

        projectfiles: function () {
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
            this.fs.copy(
                this.templatePath('jshintrc'),
                this.destinationPath('.jshintrc')
            );
            this.fs.copy(
                this.templatePath('.gitignore'),
                this.destinationPath('.gitignore')
            );
            this.fs.copy(
                this.templatePath('/src/assets'),
                this.destinationPath('/src/assets')
            );
            this.fs.copyTpl(
                this.templatePath('/src/data/site.yml'),
                this.destinationPath('/src/data/site.yml'),
                { "name": this.appname }
            );
            this.fs.copy(
                this.templatePath('/src/templates'),
                this.destinationPath('/src/templates')
            );
        }
    },

    install: function () {
        this.installDependencies({
            skipInstall: !this.options['skip-install'],
            bower: true
        });
    }
});
